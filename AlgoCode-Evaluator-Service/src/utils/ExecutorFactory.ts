import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import CodeExecutorStrategy from "../types/codeExecutorStrategy";

export default function createExecutor(codeLanguage: string): CodeExecutorStrategy | null{
    if(codeLanguage.toLowerCase() === "python"){
        return new PythonExecutor();
    } else if(codeLanguage.toLowerCase() === "java"){
        return new JavaExecutor();
    } else if (codeLanguage.toLowerCase() === "cpp"){
        return new CppExecutor();
    } else {
        return null;
    }
}