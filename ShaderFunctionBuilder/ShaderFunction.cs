using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShaderFunctionBuilder
{
    [Serializable]
    public struct ShaderFunction
    {
        public string name;
        public string tags;
        public string description;

        public ShaderExample[] examples;
    }

    [Serializable]
    public struct ShaderExample
    {
        public string name;
        public string description;
        public string shader;
        public string code;

        public ShaderProperty[] properties;
    }

    [Serializable]
    public struct ShaderProperty
    {
        public string name;
        public string id;
        public string type;
        public string value;
        public string min;
        public string max;
    }

    [Serializable]
    public struct FunctionCollection
    {
        public string[] functions;
    }
}
