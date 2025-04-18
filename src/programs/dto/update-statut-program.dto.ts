import { IsEnum } from 'class-validator';
import { ProgramStatus } from '../program.entity';

export class UpdateProgramStatutDto {

    @IsEnum(ProgramStatus)
    statut: ProgramStatus

}
