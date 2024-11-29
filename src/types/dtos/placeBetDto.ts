import { IsString, IsNumber, Min, Max } from 'class-validator';

export class PlaceBetDto {
    @IsNumber()
    @Min(1, { message: 'Amount must be greater than 0' })
    @Max(100, { message: 'Amount must be less or equal than 100' })
    amount: number;
  
    @IsString()
    sectionId: string;
}