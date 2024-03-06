import { ZodIssueCode, ZodParsedType, util, type ZodErrorMap } from 'zod';

export const esZodErrorMap: ZodErrorMap = (issue, _ctx) => {
  let message = '';
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Requerido';
      } else {
        message = `Se esperaba ${issue.expected}, se recibió ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Valor literal inválido, se esperaba ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer,
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Llave(s) desconocidas en objeto: ${util.joinValues(issue.keys, ', ')}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Valor inválido`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Valor discriminatorio inválido, se esperaba ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Valor inválido. Se esperaba ${util.joinValues(issue.options)}, se recibió '${
        issue.received
      }'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Argumentos de función inválidos`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Valor de retorno de función inválido`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Fecha inválida`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Valor inválido. Debe incluir "${issue.validation.includes}"`;

          if (typeof issue.validation.position === 'number') {
            message = `${message} en una o más ocasiones mayores o igules a ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Valor inválido. Debe comenzar con "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Valor inválido. Debe terminar con "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `${issue.validation} inválido`;
      } else {
        message = 'Inválido';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `La lista debe contener ${
          issue.exact ? 'exactamente' : issue.inclusive ? `al menos` : `más de`
        } ${issue.minimum} elemento${issue.minimum > 1 ? 's' : ''}`;
      else if (issue.type === 'string')
        message = `Texto debe contener ${
          issue.exact ? 'exactamente' : issue.inclusive ? `al menos` : `más de`
        } ${issue.minimum} caracter${issue.minimum > 1 ? 'es' : ''}`;
      else if (issue.type === 'number')
        message = `Número debe ser ${
          issue.exact ? `exactamente igual a ` : issue.inclusive ? `mayor o igual que ` : `mayor que `
        }${issue.minimum}`;
      else if (issue.type === 'date')
        message = `Fecha debe ser ${
          issue.exact ? `exactamente igual a ` : issue.inclusive ? `mayor o igual que ` : `mayor que `
        }${new Date(Number(issue.minimum))}`;
      else message = 'Valor inválido';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `La lista debe contener ${
          issue.exact ? `exactamente` : issue.inclusive ? `máximo` : `menos de`
        } ${issue.maximum} elemento${issue.maximum > 1 ? 's' : ''}`;
      else if (issue.type === 'string')
        message = `Texto debe contener ${
          issue.exact ? `exactamente` : issue.inclusive ? `máximo` : `menos de`
        } ${issue.maximum} caracter${issue.maximum > 1 ? 'es' : ''}`;
      else if (issue.type === 'number')
        message = `Número debe ser ${
          issue.exact ? `exactamente` : issue.inclusive ? `menor o igual que` : `menor que`
        } ${issue.maximum}`;
      else if (issue.type === 'bigint')
        message = `Número debe ser ${
          issue.exact ? `exactamente` : issue.inclusive ? `menor o igual que` : `menor que`
        } ${issue.maximum}`;
      else if (issue.type === 'date')
        message = `Fecha debe ser ${
          issue.exact ? `exactamente` : issue.inclusive ? `menor o igual que` : `menor que`
        } ${new Date(Number(issue.maximum))}`;
      else message = 'Valor inválido';
      break;
    case ZodIssueCode.custom:
      message = `Valor inválido`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `No pudimos unir los resultados de la intersección`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Número debe ser múltiplo de ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Número debe ser finito';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
