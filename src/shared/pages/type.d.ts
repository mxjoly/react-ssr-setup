import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

export type Page<T extends PageProps> = React.FunctionComponent<T>;

export interface PageProps extends RouteConfigComponentProps {}
