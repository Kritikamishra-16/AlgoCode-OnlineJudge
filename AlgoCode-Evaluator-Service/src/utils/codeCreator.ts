export default function codeCreator(startingCode: string, middleCode:string, endCode:string){
    return `
        ${startingCode}

        ${middleCode}

        ${endCode}
    `;
}

/**
 * 
 * For python nad java endCode can be passed as empty string
 * 
 */