import { getSetsFromScryfall } from './mtg';

export const sets = ["fic", "dft","drc","inr","fdn","j25","ltr","dsk","dsc","blb","blc","acr","mh3","m3c","otj","big","otc","otp","pip","mkm","clu","mkc","rvr","lci","mat","rex","lcc","ltc","who","woe","woc","tsr","30a","cmm","mom","moc","mul","sir","one","sld","onc","dmr","bro","scd","j22","bot","brc","gn3","plst","unf","40k","dmu","dmc","2x2","clb","snc","psnc","ncc","neo","nec","vow","voc","mid","mic","afr","afc","mh2","stx","c21","khm","khc","cmr","znr","znc","2xm","jmp","m21","iko","c20","und","thb","gn2","eld","c19","m20","mh1","war","rna","gk2","pca","uma","m19","grn","gk1","med","c18","ana","bbd","cm2","dom","ddu","a25","rix","ust","ima","xln","ddt","e01","c17","hou","cma","akh","dds","mm3","aer","c16","kld","cn2","emn","ema","soi","ogw","c15","bfz","ori","mm2","dtk","frf","jvc","dvd","gvl","evg","c14","ktk","m15","cns","md1","jou","ddm","bng","c13","ths","ddl","m14","mma","dgm","ddk","gtc","cm1","rtr","ddj","m13","pc2","avr","ddi","dka","isd","ddh","m12","cmd","nph","ddg","mbs","som","ddf","m11","arc","roe","dde","wwk","ddd","zen","hop","m10","arb","ddc","con","dd2","ala","eve","shm","mor","dd1","lrw","10e","fut","plc","tsp","csp","dis","gpt","rav","9ed","sok","bok","unh","chk","mrd","5dn","dst","8ed","scg","lgn","ons","jud","tor","ody","apc","pls","inv","pcy","nem","mmq","uds","ptk","ulg","usg","ugl","exo","sth","tmp","past","chr","4ed","3ed"]

let updatedSets: string[] | null = null;
export async function fetchSets() {
  if(!!updatedSets) {
    return updatedSets;
  }

  console.log('[sets] feching sets from scryfall');
  updatedSets = [...new Set<string>(await getSetsFromScryfall())];
  return updatedSets;
}
