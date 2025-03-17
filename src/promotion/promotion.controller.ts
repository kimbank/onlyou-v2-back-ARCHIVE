import {
  Controller,
  Body,
  UseGuards,
  Req,
  Res,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest, StateRequest } from '../type/request.type';
import { Response } from 'express';
import {
  SuccessData,
  successCode,
  successMessage,
} from '../middlewares/error.middleware';
import { UpdatePromotionDto } from './dto/updatePromotion.dto';

@ApiTags('승급심사')
@Controller('api/user/promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
  @Put()
  @ApiOperation({
    summary: '심사정보 업데이트',
  })
  @UseGuards(AuthGuard)
  async updatePromotion(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
    @Body(ValidationPipe)
    promotionDto: UpdatePromotionDto,
  ) {
    try {
      const userId = req.user.userId;
      const promotionData = await this.promotionService.updatePromotion(
        userId,
        promotionDto,
      );
      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.CREATED,
            successMessage.UPDATE_POST_SUCCESS,
            promotionData,
          ),
        );
    } catch (err) {
      throw err;
    }
  }
}
