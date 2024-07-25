import './configs/env.config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const {PORT}=process.env
  await app.listen(PORT,()=>{
    console.log(`server run =>  http://localhost:${PORT}`);
    console.log(`swagger run =>  http://localhost:${PORT}/swagger`);

    
  });
}
bootstrap();
