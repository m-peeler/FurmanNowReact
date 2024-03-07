import React from 'react';
import FUNowMapView from '../components/CustomMapView';
import ModifiedPolyline from '../components/ModifiedPolyline';
import BusStopMarker from '../components/BusStopMarker';

export default function Map() {
//   const [data, loading, fetching] = useDataLoadFetchCache(
//     'https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php',
//     'DATA:Building-Map-Info-Cache',
//     (d) => d.results,
//   );

  const lineEncoded = 'sjdtEzmcvNB\\VLLFTJLi@Rs@Zw@TYf@g@d@_@j@Y|@U|AInB?N?hA?fA?tJ?dAEhAG|@Mz@Qr@Qx@Yt@]x@a@t@e@r@g@bA}@p@s@l@w@t@iAt@s@j@k@r@sAT_@^g@`@g@f@m@RUZg@x@BjBTXFzAVhAXLDJYt@oCPo@J[Ja@Ni@Te@B[H_@HUDKDMHMPSHGFGJGHCAMI]EMK]pCeBf@e@NOLKRQZ]pBoBPQ|@_AnAqAn@m@xD{DdFeFhAkAfAgAf@g@h@k@XWjBmB`AaAt@u@n@o@n@q@d@c@d@e@pAiALKRWn@Kn@yAVYZ[DEz@}@d@c@NOn@s@l@k@d@e@Z]ZYJM\\[JM~@_ALKhAiAdAgAfAeADGx@y@xA{A|@S`CkDf@g@~A_BjBmBZYTWp@o@r@u@RS`DaD|A_BnBoBpAqAl@g@h@c@j@a@LKFCd@[LGLINGPAZM`Aa@XK?U?IN[CgAC]Ge@D_@i@MOYa@k@EIQc@Qm@EQAIG]?GAc@@g@ZsDYlCH_@FYH[h@oAbAqBt@kBRc@DIBCl@mARa@DIlAiChAaCgAjAnB{ALFl@\\VN~A|@??tAt@b@VDDbAh@lAn@d@ZvBnAxAz@j@ZfGrDbAj@hAp@h@p@rFdCnAp@FD\\P`@THHHHFHBH\\|@vESfBIb@Cf@A|@C\\Cf@Cv@EpCIh@?j@AdA?|E`@bB[xJ?fD@dD?`D?`F`@bG]^A\\@l@?L?T?|B?^@n@?nABF?z@f@r@i@H?PF\\?jABpBXT]hFHErA?\\D\\Hf@Ld@N\\BFT^^d@b@d@TTtArAd@j@V\\NV^h@j@hAr@bC|@fBjBpEnBfFvAtCPb@p@zAZ?`@AN?x@q@V_A`AwAd@s@^k@f@u@hAcBzAoBd@_AZc@hBqCpBwCXa@Tk@j@q@`@sBJ_@XgARo@Ru@n@kDUdBZgAj@sBJ_@Ne@`BaGX_@Du@BMBK??DO@IBKJc@VmABKVkALg@VOJD\\JHDJDF@JDPJLJDFFHJPBDRXTZFUDUDOBMDS@EA_ABv@{AeAfAx@RJ??AFADERCLENETGTGVe@tBCNOl@ALGTSKmAg@gBu@QK??EN??CJCL]^At@aB`GOd@K^k@rB[fA??YdASt@Sn@YfAK^_@rAi@n@YlAY`@qBvCiBpC[b@u@p@kA|BiAbBg@t@_@j@e@r@aAvAYJw@dBO?a@@[?q@{AQc@aByD{@_CuCuG_@_AqAkDMq@}@aAOWW]e@k@uAsAUUc@e@_@e@U_@CGO]Me@Ig@E]?]DsAkD]cARaCBkAC]?QGI?w@@w@?G?oACo@?_@A}B?U?M?m@?]A_@@oJUuBPaD?eD?{BSeLPq@?oGEeA?WO}@PqCHw@Dg@B]B}@Bg@@c@BgBHgCImB_@CIGIIIIIa@U]QGEoAq@mEcCoAs@uAqAw@KgGsDk@[yA{@wBoAe@[mAo@cAi@EEc@WuAu@??_B}@WOm@]MGUKQZiA`CmAhCEHS`@m@lACBEHSb@y@fBBBcApBi@nAIZGXI^AT?NAf@@b@?FF\\@HDPPl@Pb@DH`@j@NXRLN^Fd@B\\BfAOZAcA?k@?MMs@NpD?H?TYJaA`@[LQ@n@_@o@^OFMHMFe@ZGBMJk@`@i@b@m@f@qApAoBnB}A~AuCvB_@|@s@t@q@n@UV[XkBlB_B~Ag@f@kCjC_Ad@mAhBy@x@EFgAdAeAfAiAhAMJ_A~@KL]ZKL[X[\\e@d@m@j@o@r@ONe@b@{@|@ED[ZWXgAjAWXSVMJqAhAe@d@e@b@o@p@o@n@u@t@aA`AkBlBYVi@j@g@f@gAfAiAjAeFdFyDzDo@l@oApA}@~@QPqBnB[\\SPMJONg@d@qCdBUL[NOH]JeDz@c@Pa@Ry@^u@d@w@j@o@j@o@n@_@b@]b@]f@e@x@U`@Wh@eB|Dc@|@}@pAe@r@k@r@i@j@i@f@k@d@q@d@u@`@s@\\u@Xw@Tw@R{@Le@Fk@Dk@Bk@@wB@uA?w@AcAAsACo@?K?i@W_Bu@mBy@[O]Ka@EW@WHYNWXQ\\K\\If@YjAaA|DMh@';
  const secondLineEncoded = 'kretE`~cvNA??CAAACEEIEA?A?A@CDOVEFm@l@GHQVO\\GVANCR??@?\\FLDDDFFBH??hAY^Ih@O\\MFCVMJC`@UnBkApAu@^Sn@_@v@e@HE\\Wj@_@??l@`A@DP\\p@tAV|@DLHZDRF\\Nf@P\\FHBB@BTV^\\h@Z^Jj@H`@@??LA@?AO@NB?PEPM@AvD@BQHYN]LSRQRGXCVAPBb@R@GAFNHxAlAf@n@FJDJBJBP@d@@RAFABQ`@Sd@INGFKFk@P??FVDHIDHE\\hANd@??IJCDQZSZADCFEP?N?@@D@NFN?BBBBHFN@BDF?@h@`A\\b@v@j@B@\\LZND?b@@b@B`@EJAt@]FGv@w@Z[JS?Q?ICKIQACS]CEe@}@AASa@Uc@GM[XZYMUUa@??`AaAZ[Z[RSr@mA??P?PENGPMDMDDEEDKFc@?QEOGSKQOMOEWA??c@c@eCoCuB}Bq@k@?A?@s@k@}D}BgCyA??AO?MAKAGCGCGCIEGGGEGECEEECGCWGGAI?E?K@E@YJKFIJKNGP?DOENDCJCZ@X??aA[a@Ma@MKCy@SEAeBTOFIDUNGDWRKJ??EQDPYV]Xa@^WPKHk@^]VIDw@d@o@^_@RqAt@oBjAa@TKBWLGB]Li@N_@HiAX??CIGGEEME]GA???BS@OFWN]PJF@DAJEPOTSNUR]BI?C?A';

  return (
    <FUNowMapView>
      <ModifiedPolyline
        encodedCoordinates={lineEncoded}
        strokeColor="#12d76f"
        strokeWidth={9}
        lineJoin="round"
      />
      <ModifiedPolyline
        encodedCoordinates={secondLineEncoded}
        strokeColor="#582C83"
        strokeWidth={9}
        lineJoin="round"
      />
      <BusStopMarker
        color="#582C83"
        coordinate={{ latitude: 34.92437802079961, longitude: -82.43845380335945 }}
        title="Duke Library"
        eta="5 min."
      />
    </FUNowMapView>
  );
}
