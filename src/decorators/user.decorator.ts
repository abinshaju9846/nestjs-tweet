import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  
  
  export const GetUserId = createParamDecorator(
    (_, context: ExecutionContext): string => {
      const request = context.switchToHttp().getRequest();
      console.log("use decorator request",request.user_id);
      
      const user = request?.user?.user_id;
        console.log("user decrotaor",user);
        
  
      if (!user) {
        throw new UnauthorizedException('User ID not found in token');
      }
  
  
      return user;
    },
  );
  
  