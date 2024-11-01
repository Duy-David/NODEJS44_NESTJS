import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request, Response } from 'express';
import { VideoDto } from './dto/video.dto';
import { ApiBearerAuth, ApiHeader, ApiHeaders, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Video")//chia cụm API 
@Controller('/video')
export class VideoController { 

  constructor(private readonly videoService: VideoService) {}
  @ApiBearerAuth( )
  @UseGuards(AuthGuard("jwt"))
  @Post('/create-video')
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Res() res: Response,
  ): Promise<Response<VideoDto>> {
    let newVideo = await this.videoService.create(createVideoDto);
    // return res.status(HttpStatus.CREATED).json(createVideoDto);
    return res.status(HttpStatus.CREATED).json(newVideo);
  }

  @Get('/get-videos')
  // làm mất required trong swagger
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiHeader({ name: 'token', required: false })
  @ApiResponse({status:HttpStatus.OK,description:"Get list videos successfully"})
  @ApiResponse({status:HttpStatus.INTERNAL_SERVER_ERROR,description:"Internal Server"})
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    // @Header('token') token: string,
    @Res() res: Response,
    @Headers('token') token: string,
    // @Req() req: Request,
  ): Promise<Response<VideoDto[]>> {
    try {
      // let header = req.headers.token;
      // return await res.status(HttpStatus.OK).json({ page, size, keyword, token })
      // format datatype cho page và size
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      let videos = await this.videoService.findAll(
        formatPage,
        formatSize,
        keyword,
      );
      return res.status(HttpStatus.OK).json(videos);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.videoService.remove(+id);
  }
}
