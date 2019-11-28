import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import frontendHostUrl from '../constants/frontend';
 
export default () => <SwaggerUI url={frontendHostUrl + "backend_api.yaml"} />;
