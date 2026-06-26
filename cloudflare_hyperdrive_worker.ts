import { Client } from 'pg';

export interface Env {
  // Cloudflare dashboard에서 설정한 Hyperdrive 바인딩
  HYPERDRIVE: any;
}

/**
 * Hyperdrive 클라이언트를 생성하는 유틸리티 함수
 */
export function createHyperdriveClient(connectionString: string): Client {
  return new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    // 유틸리티 함수를 사용하여 클라이언트 생성
    const client = createHyperdriveClient(env.HYPERDRIVE.connectionString);

    try {
      await client.connect();

      const url = new URL(request.url);

      // 3. [GET] DB 상태 확인 (어드민 대시보드용)
      if (request.method === 'GET' && url.pathname === '/api/db-status') {
        const result = await client.query('SELECT version();');
        return Response.json({ 
          success: true, 
          status: 'connected', 
          version: result.rows[0].version 
        });
      }

      // 1. [POST] 후원 신청 데이터 입력
      if (request.method === 'POST' && url.pathname === '/api/sponsorship') {
        const body = await request.json();
        const { name, hp, amount, type, message } = body as any;

        const query = `
          INSERT INTO sponsorship (sp_name, sp_hp, sp_amount, sp_type, sp_message)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING sp_id;
        `;
        
        const result = await client.query(query, [name, hp, amount, type, message]);
        return Response.json({ success: true, id: result.rows[0].sp_id });
      }

      // 2. [GET] 후원 리스트 조회 (캐싱을 통한 초고속 응답 가능)
      if (request.method === 'GET' && url.pathname === '/api/sponsorship') {
        // Hyperdrive는 SELECT 쿼리를 자동으로 엣지 캐싱하여 전 세계 어디서든 빠르게 응답합니다.
        const query = 'SELECT * FROM sponsorship ORDER BY sp_datetime DESC LIMIT 10;';
        const result = await client.query(query);
        return Response.json({ success: true, data: result.rows });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error: any) {
      console.error('Hyperdrive Error:', error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    } finally {
      // 요청 생명주기 밖에서 연결을 안전하게 종료하도록 waitUntil로 처리
      ctx.waitUntil(client.end());
    }
  },
};
