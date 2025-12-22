import { IsString , MinLength, IsUUID  } from "class-validator";

export class AcceptInvitationDto {
    @IsUUID()
    token: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(2)
    fullName: string;
}   