import React from 'react';
import { Series } from 'remotion';
import { scene } from './theme';
import { S1Apagon } from './scenes/S1Apagon';
import { S2Falla } from './scenes/S2Falla';
import { S3Tanque } from './scenes/S3Tanque';
import { S4Servicios } from './scenes/S4Servicios';
import { S5Prueba } from './scenes/S5Prueba';
import { S6Cta } from './scenes/S6Cta';

export const Video: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={scene.apagon}>
      <S1Apagon />
    </Series.Sequence>
    <Series.Sequence durationInFrames={scene.falla}>
      <S2Falla />
    </Series.Sequence>
    <Series.Sequence durationInFrames={scene.tanque}>
      <S3Tanque />
    </Series.Sequence>
    <Series.Sequence durationInFrames={scene.servicios}>
      <S4Servicios />
    </Series.Sequence>
    <Series.Sequence durationInFrames={scene.prueba}>
      <S5Prueba />
    </Series.Sequence>
    <Series.Sequence durationInFrames={scene.cta}>
      <S6Cta />
    </Series.Sequence>
  </Series>
);
