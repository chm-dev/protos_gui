using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Drawing;
using System.IO;
using Newtonsoft.Json;
using System.Diagnostics;

namespace IconExtractor
{

    class IconRequest
    {

        public string Context { get; set; }
        public string Path { get; set; }
        public string Base64ImageData { get; set; }

    }

    class Program
    {
        static void Main(string[] args)
        {

            // https://msdn.microsoft.com/en-us/library/ms404308%28v=vs.110%29.aspx?f=255&MSPPError=-2147217396

            Console.InputEncoding = UTF8Encoding.UTF8;
            Console.OutputEncoding = UTF8Encoding.UTF8;

            string input = args[0].Trim();

            var jsonData = JsonConvert.DeserializeObject<dynamic>(input);
            string outputJSON = "[";
            foreach (var data in jsonData)
            {
                if (data != jsonData.First) { outputJSON += ","; }

                data.Base64ImageData = getIconAsBase64(data.Path.Value);
                outputJSON += JsonConvert.SerializeObject(data);
                //System.Diagnostics.Debugger.Break();

                //                }
                //              catch (Exception ex)
                //            {
                //              Console.Error.WriteLine(ex);
                //            Console.Error.WriteLine(input);
                //      }
            }
            outputJSON += "]";
            Console.WriteLine(outputJSON);
        }



        static string getIconAsBase64(string path)
        {
            if (!File.Exists(path))
            {
                return "";
            }

            Icon iconForPath = SystemIcons.WinLogo;
            iconForPath = Icon.ExtractAssociatedIcon(path);

            ImageConverter vert = new ImageConverter();
            byte[] data = (byte[])vert.ConvertTo(iconForPath.ToBitmap(), typeof(byte[]));

            return Convert.ToBase64String(data);
        }
    }
}
