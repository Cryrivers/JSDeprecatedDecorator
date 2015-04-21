function deprecated (deprecatedVersion?:string, removeVersion?:string, memo?: string)
{
    const cssVersion = 'color:orangered';
    const cssDefault = 'color:inherit';
    let message = ['was deprecated. '];

    if(deprecatedVersion)
    {
        message[0] = message[0].substring(0, message[0].length - 2) + ` since version %c${deprecatedVersion}%c. `;
        message.push(cssVersion, cssDefault);
    }

    if(removeVersion)
    {
        message[0] = message[0].substring(0, message[0].length - 2) + ` and will be removed at version %c${removeVersion}%c. `;
        if(!deprecatedVersion)
        {
            message[0] = message[0].substring(4, message[0].length);
        }
        message.push(cssVersion, cssDefault);
    }

    if(memo)
    {
        message[0] = message[0] + memo;
    }

    return function(...args: any[])
    {
        if(args.length === 1)
        {
            let ClassConstructor = args[0];
            return function(...ctorArgs: any[])
            {
                message[0] = `Class ${ClassConstructor.name} ${message[0]}`;
                console.warn.apply(console, message);
                let Ctor = function() {}, instance, ret;
                Ctor.prototype = ClassConstructor.prototype;
                instance = new Ctor();
                ret = ClassConstructor.apply(instance, ctorArgs);
                return Object(ret) === ret ? ret : instance;
            }
        }
        else
        {
            let target = args[0],
                name = args[1],
                descriptor = args[2],
                originalFunc = target[name];

            descriptor.value = function(...arg)
            {
                message[0] = `Function ${name} ${message[0]}`;
                console.warn.apply(console, message);
                originalFunc.apply(target, arg);
            };

            return descriptor;
        }
    }
}

export default deprecated;