import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Simple request logger (works with Express)
  const instance = app.getHttpAdapter().getInstance() as any;
  if (instance && typeof instance.use === 'function') {
    instance.use((req: any, _res: any, next: any) => {
      console.log(`[REQ] ${req.method} ${req.url}`);
      next();
    });
  } else {
    app.use?.((req: any, _res: any, next: any) => {
      console.log(`[REQ] ${req.method} ${req.url}`);
      next();
    });
  }

  // Ensure app is initialized so routes are registered, then list routes (Express only)
  await app.init();
  try {
    const router = (app.getHttpAdapter().getInstance() as any)?._router;
    if (router && Array.isArray(router.stack)) {
      const routes = router.stack
        .filter((layer: any) => layer.route)
        .flatMap((layer: any) =>
          Object.keys(layer.route.methods).map((m) => `${m.toUpperCase()} ${layer.route.path}`),
        );
      console.log('Registered routes:', routes);
    }
  } catch (err) {
    console.log('Could not list routes:', err?.message ?? err);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
