module.exports = {
  apps: [
    {
      name: 'vijayavyuham',
      script: 'npx',
      // No bindings: runs in offline fallback mode locally (no Supabase).
      // To test WITH Supabase, add a .dev.vars file (see .dev.vars.example)
      // and wrangler will inject those vars automatically.
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
