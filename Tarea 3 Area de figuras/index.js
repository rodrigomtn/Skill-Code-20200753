const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Mensajes que respondera en dos idiomas:  ingles y español
const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome, the area of which figure do you want to calculate?',
            ERROR_FIGURE: 'The area of the figure you want to calculate is not available.',
            HELP: 'I can help you calculate the area of a triangle, rectangle and circle, you can try "calculate the area of a circle with radius 3" or "calculate the area of a rectangle with base 2 and height 4"',
            CANCEL: 'Goodbye, if you need to calculate the area of another figure, I am here to help you.',
            FALLBACK: 'Im sorry, I dont understand what youre asking.',
            ERROR_HANDLER: 'Sorry, I had trouble doing what you asked. Please try again. :c',
            RESPUNO: 'The area of the ',
            RESPDOS: ' is '
        }
    },
    es:{
        translation: {
            WELCOME_MESSAGE: 'Bienvenido, ¿El area de que figura desea calcular?',
            ERROR_FIGURE: 'El área de la figura que deseas calcular no está disponible.',
            HELP: 'Puedo ayudarte a calcular el area de un triangulo, rectangulo y circulo, puedes probar con "calcula el area de un circulo con radio 3" o con "calcula el area de un rectangulo con base 2 y altura 4"',
            CANCEL: 'Adiós, si necesitas calcular el area de otra figura, estoy aqui para ayudarte.',
            FALLBACK:'Perdon, no entiendo lo que preguntas.',
            ERROR_HANDLER: 'Lo siento, tuve problemas para hacer lo que me pediste. Inténtalo de nuevo.',
            RESPUNO: 'El área del ',
            RESPDOS: ' es '
        }
    }
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// Funcion Para calcular el area
const CustomCalcularAreaIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CalcularAreaIntent'
    );
  },
  handle(handlerInput) {
    //Aqui recibo las respuestas que se enviaran al usuario en base al idioma
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const error_fig = requestAttributes.t('ERROR_FIGURE');
    const resp_uno = requestAttributes.t('RESPUNO');
    const resp_dos = requestAttributes.t('RESPDOS');

    let respuesta;
    let area;
    
    const slots = handlerInput.requestEnvelope.request.intent.slots;

    const figura = slots.figura.value;
    const base = slots.base.value;
    const altura = slots.altura.value;
    const radio = slots.radio.value;
    
    // Con estos IF evaluo el tipo de figura que es para hacer las operaciones correspondientes
    if(figura === 'rectangulo' || figura === 'rectángulo' || figura === 'rectangle'){
        area = base * altura;
    }else if(figura === 'triangulo' || figura === 'triángulo' || figura === 'triangle'){
        area = (base * altura) / 2;
    }else if(figura === 'circulo' || figura === 'circle'){
        area = Math.PI * radio * radio;
    }
    
    if (!area) {
        respuesta = error_fig;
    } else {
        respuesta = resp_uno + figura +  resp_dos + area.toFixed(2);
    }

    return handlerInput.responseBuilder
      .speak(respuesta)
      .withShouldEndSession(false)
      .getResponse();
  },
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakHelp = requestAttributes.t('HELP');

        return handlerInput.responseBuilder
            .speak(speakHelp)
            .reprompt(speakHelp)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakCancel = requestAttributes.t('CANCEL');
        
        return handlerInput.responseBuilder
            .speak(speakCancel)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakFallback = requestAttributes.t('FALLBACK');

        return handlerInput.responseBuilder
            .speak(speakFallback)
            .reprompt(speakFallback)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// FUNCIONES PARA SABER EL IDIOMA
const LoggingRequestInterceptor = {
    process(handlerInput){
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const LocalizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });
        
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function(...args){
            return LocalizationClient.t(...args);
        }
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        CustomCalcularAreaIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();