/////////////////////////
//Visualization Settings
/////////////////////////

let width = 1800
let height = 980
let graphEdge = 700
let graphBorder = 100
let fps = 240 //steps per second
let displayFrac = 4 //Display paths/Update win % every N steps

////////////////////
//Learning Settings
////////////////////

let qLearn = 1
let gamma = .99

let its = 0 //initializes counter to 0
let alpha = .1
let targetAlpha = .00001
let targetItsAlpha = 40000
let alphaUpdate = (targetAlpha/alpha)**(1/targetItsAlpha)

let epsilon = 1
let targetEpsilon = .0001
let targetItsEpsilon = 40000
let epsilonUpdate = (targetEpsilon/epsilon)**(1/targetItsEpsilon)

/////////////
//Define MDP
/////////////

//Initial State
let lukeScore = 0
let lukePos = [0,0]

//Actions
let actions = ["UP","DOWN","LEFT","RIGHT"]

//Rewards (Implicitly Defines State Space)

/* let rewardMap = [[  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,-100,-100,-100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,-100,-100,-100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,-100,-100,-100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 100]] */

let rewardMap = [[  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,    -1,   -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,    -100,   -1,  -1,  -100,  -1],
                 [  -1,  -1,  -1,  -100,  -100,  -1,  -1,  -1,  -1,  -1,    -1,   -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -100,  -100,  -1,  -1,  -1,  -1,  -100,  -100, -100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -100,  -100, -100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -100,  -100, -100,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,    -1,   -1,  -1,  -1,  -1],
                 [  -1,  -1,  -100,  -100,  -100,  -100,  -1,  -1,  -1,  -1,  -100, -1,  -1,  -100,  -1],
                 [  -1,  -1,  -100,  -100,  -100,  -100,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1,  -1],
                 [  -1,  -1,  -100,  -1,  -1,  -100,  -1,  -1,  -1,  -1,  -100, -1,  -1,  -100,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1,  -1],
                 [  -1,  -1,  -100,  -1,  -1,  -100,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1,  -1],
                 [  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,  -1,  -1, 100]]

function getReward(s, map=rewardMap){return map[s[1]][s[0]]}

let maxY = rewardMap.length 
let maxX = rewardMap[0].length

console.log([maxY, maxX])
console.log(rewardMap)
//Transition Function 

randomness = 0.10

function transitionFunction(action, state, map=rewardMap){

    if(Math.abs(getReward(state))==100){
        return [[state,1,0]]    
    }
    else{

        let maxY = map.length 
        let maxX = map[0].length

        let sNext = JSON.parse(JSON.stringify(state))
        
        actionDist = []

        for(let a=0; a<actions.length;a++){
            sNext = JSON.parse(JSON.stringify(state)) 
            if(actions[a]=="UP"){                           
                sNext[1]-- 
            }
            else if(actions[a]=="DOWN"){
                sNext[1]++
            }
            else if(actions[a]=="RIGHT"){
                sNext[0]++
            }
            else if(actions[a]=="LEFT"){
                sNext[0]--
            }
            else{throw new Error('NOT A VALID ACTION')}

            sNext[0] = Math.min(sNext[0],maxX-1)
            sNext[0] = Math.max(sNext[0],0)
            sNext[1] = Math.min(sNext[1],maxY-1)
            sNext[1] = Math.max(sNext[1],0)
            
            let pState = randomness/3
            if(actions[a]==action){
                pState = 1-randomness
            }
            rNext = getReward(sNext)
            actionDist.push([sNext,pState,rNext])
            
        }        
        
        return actionDist
    }
}

//Initialize Q

let qValueMap = []

for(let a=0;a<actions.length;a++){
    qValueMap[a] = []
    for(let j=0;j<maxY;j++){
        qValueMap[a][j] = []
        for(let i=0;i<maxX;i++){ 
            if(Math.abs(getReward([i,j]))==100){                        
                qValueMap[a][j][i] = 0
            }
            else{
                qValueMap[a][j][i] = 100*(Math.random()*2-1)
            }
        }   
    }
}

function getQValue(s, map=qValueMap){return map[s[2]][s[1]][s[0]]}

function getMaxQValue(s, map=qValueMap){
    
    let maxQVal = -Infinity
    for(let a=0;a<actions.length;a++){
        //console.log(a)
        if(maxQVal<map[a][s[1]][s[0]]){
            maxQVal = map[a][s[1]][s[0]]
        }
    }
    return maxQVal
}

//Initialize V

let valueMap = []
for(let j=0;j<maxY;j++){
    valueMap[j] = []
    for(let i=0;i<maxX;i++){ 
        if(Math.abs(getReward([i,j]))==100){
            //console.log([i,j])        
            valueMap[j][i] = getReward([i,j])
        }
        else{
            if(qLearn){
                valueMap[j][i] = getMaxQValue([i,j])
            }else{
                valueMap[j][i] = 100*(Math.random()*2-1)
            }
            
        }
    }}

function getValue(s, map=valueMap){return map[s[1]][s[0]]}

function computeActMaxQ(state){
    if(qLearn){    
        let values = []
        
        for(let a=0; a<actions.length;a++){                                
            transProbs = transitionFunction(actions[a],state)            
            let expectation = 0
            for(let s=0; s<transProbs.length;s++){ 
                expectation += (transProbs[s][2]+gamma*getMaxQValue(transProbs[s][0])) * transProbs[s][1] 
            }
            values.push(expectation)                
        }
    
        let value = Math.max(...values)

        return actions[values.indexOf(value)]    
    }else{
        let values = []
        
        for(let a=0; a<actions.length;a++){                                
            transProbs = transitionFunction(actions[a],state)
            let expectation = 0
            for(let s=0; s<transProbs.length;s++){ 
                expectation += (transProbs[s][2]+gamma*getValue(transProbs[s][0])) * transProbs[s][1] 
            }
            values.push(expectation)                
        }
    
        let value = Math.max(...values)

        return actions[values.indexOf(value)]
    }    
}


/////////////////////////
//Visualization Elements
/////////////////////////

//Create SVG
let svg = d3.select('#viz').append('svg').attr("width",width).attr("height",height)

//Layout, Labels, and Controls
svg.append("text").text("Catch Boba Fett!").attr("dominant-baseline","middle").attr("text-anchor","middle").attr("font-weight","bold")
                    .attr("x",1.5*graphBorder+graphEdge).attr("y",graphBorder/3).attr("font-family", "monospace").attr("font-size",graphBorder/4).attr("fill","rgb(50,50,50)")   


svg.append("text").text("Estimated Value").attr("dominant-baseline","middle").attr("text-anchor","middle")
                    .attr("x",graphBorder+graphEdge/2).attr("y",2*graphBorder/3).attr("font-family", "monospace").attr("font-size",graphBorder/4).attr("fill","rgb(50,50,50)") 
                    
svg.append("text").text("Actual Rewards").attr("dominant-baseline","middle").attr("text-anchor","middle")
                    .attr("x",2*graphBorder+1.5*graphEdge).attr("y",2*graphBorder/3).attr("font-family", "monospace").attr("font-size",graphBorder/4).attr("fill","rgb(50,50,50)")   
  
                    
moveButton = svg.append("rect").attr("x",graphBorder+graphEdge/2-100).attr("y",25+graphBorder+graphEdge)
.attr("height", 50).attr("width",200).attr("rx",5)
.attr("fill",`rgba(0,0,0,.25)`).attr("stroke", "rgb(50,50,50)").on("click",move)

svg.append("text").text("Learn").attr("dominant-baseline","middle").attr("text-anchor","middle")
                                .attr("x",2*graphBorder+1.5*graphEdge).attr("y",50+graphBorder+graphEdge)
                                .attr("font-family", "monospace").attr("font-size",20)
                                .attr("fill","rgb(50,50,50)")
                                .on("click",learn)

learnButton = svg.append("rect").attr("x",2*graphBorder+1.5*graphEdge-100).attr("y",25+graphBorder+graphEdge)
                    .attr("height", 50).attr("width",200).attr("rx",5)
                    .attr("fill",`rgba(0,0,0,.25)`).attr("stroke", "rgb(50,50,50)").on("click",learn)
                    
svg.append("text").text("Move").attr("dominant-baseline","middle").attr("text-anchor","middle")
                                .attr("x",graphBorder+graphEdge/2).attr("y",50+graphBorder+graphEdge)
                                .attr("font-family", "monospace").attr("font-size",20)
                                .attr("fill","rgb(50,50,50)")
                                .on("click",move)

let score = svg.append("text").text("Score: 0").attr("dominant-baseline","middle").attr("text-anchor","middle")
.attr("x",graphBorder+graphEdge/2).attr("y",100+graphBorder+graphEdge).attr("font-family", "monospace").attr("font-size",20).attr("fill","rgb(50,50,50)").on("click",move)    

let winPct = svg.append("text").text("Wins: 0").attr("dominant-baseline","middle").attr("text-anchor","middle")
.attr("x",2*graphBorder+1.5*graphEdge).attr("y",100+graphBorder+graphEdge).attr("font-family", "monospace").attr("font-size",20).attr("fill","rgb(50,50,50)").on("click",move)

let valueFunction = getValue
if(qLearn){valueFunction = getMaxQValue}


//Build map of current V estimates
let glyphMap = []
for(let j=0;j<maxY;j++){
    glyphMap[j] = []
    for(let i=0;i<maxX;i++){ 

        let value = JSON.parse(JSON.stringify(valueMap[j][i]))
        value = Math.max(-50,value)
        value = Math.min(50,value)        
        shade = 255 * ((value+50)/100)
        glyphMap[j][i] = svg.append("rect").attr("x",graphBorder+i*(graphEdge/maxX)).attr("y",graphBorder+j*(graphEdge/maxY))
                        .attr("height", graphEdge/maxY).attr("width",graphEdge/maxX)
                        .attr("fill",`rgba(${255-shade},${shade},0,.75)`).attr("stroke", "rgb(50,50,50)")
}}

//Build labels for current V estimates
let labelMap = []
for(let j=0;j<maxY;j++){
    labelMap[j] = []
    for(let i=0;i<maxX;i++){ 
        let value = JSON.parse(JSON.stringify(valueMap[j][i]))    
        labelMap[j][i] = svg.append("text").text(parseInt(value)).attr("dominant-baseline","middle").attr("text-anchor","middle")
        .attr("x",graphBorder+(i+.5)*(graphEdge/maxX)).attr("y",graphBorder+(j+.5)*(graphEdge/maxY)).attr("font-family", "monospace").attr("font-size",15).attr("fill","rgb(50,50,50)")   
}}

//Build ground truth reward map
let glyphMapGT =[]
for(let j=0;j<maxY;j++){
    glyphMapGT[j] = []
    for(let i=0;i<maxX;i++){ 
        let value = JSON.parse(JSON.stringify(rewardMap[j][i]))
        value = Math.max(-50,value)
        value = Math.min(100,value)       
        shade = 255 * ((value+50)/150)
        glyphMapGT[j][i] = svg.append("rect").attr("x",graphBorder*2+graphEdge+i*(graphEdge/maxX)).attr("y",graphBorder+j*(graphEdge/maxY))
                        .attr("height", graphEdge/maxY).attr("width",graphEdge/maxX)
                        .attr("fill",`rgba(${255-shade},${shade},0,.75)`).attr("stroke", "rgb(50,50,50)")
}}

//Build labels for Rewards

for(let j=0;j<maxY;j++){    
    for(let i=0;i<maxX;i++){ 
        
        svg.append("text").text(parseInt(rewardMap[j][i])).attr("dominant-baseline","middle").attr("text-anchor","middle")
        .attr("x",graphEdge+2*graphBorder+(i+.5)*(graphEdge/maxX)).attr("y",graphBorder+(j+.5)*(graphEdge/maxY)).attr("font-family", "monospace").attr("font-size",15).attr("fill","rgb(50,50,50)")   
}}

//Initialize Paths

let pathGroup = svg.append("g").attr("transform",`translate(${2*graphBorder+graphEdge} ${graphBorder})`).attr("stroke-width", "3")
let pathGlyphs = []
let dList = []
let winList = []
let pathCount = 60//500//
let maxOpacity = .2//175//.05//
for(let i=0;i<pathCount;i++){
    dList.push("")
    winList.push(0)
    pathGlyphs.push(pathGroup.append("path").attr("d",dList[i]).attr("stroke", `rgba(0,0,0,${maxOpacity*(pathCount-i)/pathCount})`).attr("fill","None"))//.attr("opacity",(pathCount-i)/(pathCount)))

    //console.log(maxOpacity*(pathCount-i)/pathCount)
}

//Add characters 

let characters = svg.append("g")

/* let boba = svg.append('image').attr('href', "../PolicyIteration/boba.png").attr("x",705+8*(500/maxX)).attr("y",205+8*(500/maxY)).attr("height",500/maxY -10).attr("width",500/maxX -10);

let bobaV = svg.append('image').attr('href', "../PolicyIteration/boba.png").attr("x",105+8*(500/maxX)).attr("y",205+8*(500/maxY)).attr("height",500/maxY -10).attr("width",500/maxX -10);

let 

let sarlaccV = svg.append('image').attr('href', "../PolicyIteration/sarlacc.png").attr("x",105+3*(500/maxX)).attr("y",205+3*(500/maxY)).attr("height",3*(500/maxY) -10).attr("width",3*(500/maxX) -10);*/

let sarlacc = svg.append('image').attr('href', "../Qlearning_II/sarlacc.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+9*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+3*(graphEdge/maxY)+5)
                                    .attr("height",3*(graphEdge/maxY) -10)
                                    .attr("width",3*(graphEdge/maxX) -10);

let barge = characters.append('image').attr('href', "../Qlearning_II/barge.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+2*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+7*(graphEdge/maxY)+5)
                                    .attr("height",2*(graphEdge/maxY) -10)
                                    .attr("width",4*(graphEdge/maxX) - 10);

let advisor = characters.append('image').attr('href', "../Qlearning_II/advisor.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+3*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+2*(graphEdge/maxY)+5)
                                    .attr("height",2*(graphEdge/maxY) -10)
                                    .attr("width",2*(graphEdge/maxX) - 10);

let boba = characters.append('image').attr('href', "../Qlearning_II/boba.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+14*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+14*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);


let luke = characters.append('image').attr('href', "../PolicyIteration/luke.png").attr("x",5+graphBorder).attr("y",graphBorder+5).attr("height",graphEdge/maxY -10).attr("width",graphEdge/maxX -10); 

/* console.log(rewardMap)
for(let i=0;i<rewardMap.length;i++){
    for(let j=0;j<rewardMap[0].length;j++){
        console.log(rewardMap[i][j])
        if(rewardMap[i][j]==-100){
            
            characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
            .attr("preserveAspectRatio","none")
            .attr("x",graphBorder+j*(graphEdge/maxX)+5)
            .attr("y",graphBorder+i*(graphEdge/maxY)+5)
            .attr("height",(graphEdge/maxY) -10)
            .attr("width",(graphEdge/maxX) - 10);

        }
    }
} */

//Upper Right

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+10*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+1*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);


characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+13*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+1*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);
                                    
//Bottom Right

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+13*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+7*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+10*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+7*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+10*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+10*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+13*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+10*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

//Bottom Left

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+2*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+10*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+2*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+13*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+5*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+10*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);

characters.append('image').attr('href', "../Qlearning_II/gamorrian.png")
                                    .attr("preserveAspectRatio","none")
                                    .attr("x",graphBorder+5*(graphEdge/maxX)+5)
                                    .attr("y",graphBorder+13*(graphEdge/maxY)+5)
                                    .attr("height",(graphEdge/maxY) -10)
                                    .attr("width",(graphEdge/maxX) - 10);




/////////////////////////
//Visualization Functions
/////////////////////////

function gridCenter(pos){
    return ` L ${(pos[0]+.5)*(graphEdge/maxX)+(Math.random()*7-3.5)} ${(pos[1]+.5)*(graphEdge/maxY)+(Math.random()*7-3.5)}`
}

let wins = 0

function updatePaths(path,win){

    dList.pop()
    dList.unshift(path)
    winList.pop()
    winList.unshift(win)    
    wins = .999*wins + .001*win
    
    if(its%displayFrac==0){        
        for(let i=0;i<dList.length;i++){
            pathGlyphs[i].attr("d",dList[i]).attr("stroke", `rgba(${winList[i]*255},${winList[i]*255},${winList[i]*255},${maxOpacity*(pathCount-i)/pathCount})`)
        }
        
        winPct.text(`Wins: ${Math.round(wins*100)}%`) 
    }
    
}

function move(V=valueMap){
    
    bestAction = computeActMaxQ(lukePos,V)
    
    transProbs = transitionFunction(bestAction,lukePos)

    //Make cumulative distribution
    cumulativeP = 0
    for(let i=0;i<transProbs.length;i++){
        cumulativeP +=transProbs[i][1]
        transProbs[i][1] = cumulativeP

    }
    
    //Take action, take chances
    dieRoll = Math.random()
    
    for(let i=0;i<transProbs.length;i++){
        if(dieRoll<transProbs[i][1]){
            lukeScore += transProbs[i][2]
            if(Math.abs(transProbs[i][2])!=0){
                lukePos = transProbs[i][0]}      
            else{
                lukePos = [0,0]
                lukeScore = 0
            }
            console.log(lukePos)
            break
        }
    }

    luke.attr("x",5+graphBorder+ lukePos[0]*(graphEdge/maxX)).attr("y",graphBorder+5 + lukePos[1]*(graphEdge/maxY))
    score.text(`Score: ${lukeScore}`) 
    console.log(transProbs)
}


/////////////////////
//Learning Functions
/////////////////////

function updateValues(V=valueMap){

    for(let j=0;j<maxY;j++){
        for(let i=0;i<maxX;i++){
            values = []

            //Get expected values of actions
            for(let a=0; a<actions.length;a++){                                
                transProbs = transitionFunction(actions[a],[i,j])
                let expectation = 0
                for(let s=0; s<transProbs.length;s++){ 
                    expectation += transProbs[s][1]*(transProbs[s][2]+gamma*getValue(transProbs[s][0]))
                }
                values.push(expectation)                
            }

            //Assume we do the max expected value action
            let value = Math.max(...values)
            V[j][i] = value
            
            //Update color and value label            
            if(its%displayFrac==0){                
                value = Math.min(100,value)
                value = Math.max(-50,value)    
                shade = 255 * ((value+50)/150)
                glyphMap[j][i].attr("fill",`rgba(${255-shade},${shade},0,.75)`)
                labelMap[j][i].text(parseInt(V[j][i]))
            }
    }}

    //Generate Sample Path
    
    let learningPos = [0,0]
    let d = `M ${.5*(graphEdge/maxX)} ${.5*(graphEdge/maxY)}`
    d += gridCenter(learningPos)
    let steps = 0
    while(steps<200){       
        action = computeActMaxQ(learningPos)
        
        let testOut = testStep(learningPos, action)
             
        learningPos = testOut[0]
        
        d += gridCenter(learningPos)

        //console.log(learningPos)

        if(Math.abs(rewardMap[testOut[0][1]][testOut[0][0]])==100){
            if(rewardMap[testOut[0][1]][testOut[0][0]]==100){
                updatePaths(d,1)
            }else{
                updatePaths(d,0)
            }

            break
        }else{
            steps++        
        }
    }
    its++
}

function updateQValues(){
    
    alpha *= alphaUpdate
    if(its%100==0){console.log(`Iteration: ${its}`);console.log(`Alpha: ${alpha}`)}
    
    //if(its%2500==0){
        //alpha/=2
    
    //}

    
    for(let j=0;j<maxY;j++){
        for(let i=0;i<maxX;i++){
            for(let a=0;a<actions.length;a++){
                let testOut = testStep([i,j], actions[a])
                //console.log(testOut)
                    qValueMap[a][j][i] = (1-alpha) * qValueMap[a][j][i] + alpha*(testOut[1] + gamma*getMaxQValue(testOut[0]))
                    values = []
                }
                //Assume we do the max expected value action
                let value = getMaxQValue([i,j])
                valueMap[j][i] = value
                
                //Update color and value label
                if(its%displayFrac==0){
                    value = Math.min(100,value)
                    value = Math.max(-50,value)    
                    shade = 255 * ((value+50)/150)
                    glyphMap[j][i].attr("fill",`rgba(${255-shade},${shade},0,.75)`)
                    labelMap[j][i].text(parseInt(valueMap[j][i]))
                }
              
        }
    }
    its++
}

function updateQValuesEG(){
    
    if(alpha>=targetAlpha){
        alpha *= alphaUpdate
        if(its%100==0){console.log(`Iteration: ${its}`);console.log(`Alpha: ${alpha}`)}
    }else{
        //alpha = 0
        //epsilon = 0
        //randomness = 0
    }
    if(epsilon>=targetEpsilon){
        epsilon *= epsilonUpdate
        if(its%100==0){console.log(`Epsilon: ${epsilon}`)}
        
    }

    learningPos = [0,0]
    d = `M ${.5*(graphEdge/maxX)} ${.5*(graphEdge/maxY)}`
    d += gridCenter(learningPos)
    while(true){
        
        if(Math.random()<epsilon){
            action = actions[Math.floor(actions.length * Math.random())]
        }else{
            action = computeActMaxQ(learningPos)
        }
        let testOut = testStep(learningPos, action)
        let a = actions.indexOf(action) 
        qValueMap[a][learningPos[1]][learningPos[0]] = (1-alpha) * qValueMap[a][learningPos[1]][learningPos[0]] + alpha*(testOut[1] + gamma*getMaxQValue(testOut[0]))
              
        //Set state value to max qvalue
        let value = getMaxQValue(learningPos)
        valueMap[learningPos[1]][learningPos[0]] = value
        
        //Update color and value label
        if(its%displayFrac==0){
            value = Math.min(100,value)
            value = Math.max(-50,value)    
            shade = 255 * ((value+50)/150)
            glyphMap[learningPos[1]][learningPos[0]].attr("fill",`rgba(${255-shade},${shade},0,.75)`)
            labelMap[learningPos[1]][learningPos[0]].text(parseInt(valueMap[learningPos[1]][learningPos[0]]))
        }
            
        learningPos = testOut[0]
        
        d += gridCenter(learningPos)

        //console.log(learningPos)

        if(Math.abs(rewardMap[testOut[0][1]][testOut[0][0]])==100){
            if(rewardMap[testOut[0][1]][testOut[0][0]]==100){
                updatePaths(d,1)
            }else{
                updatePaths(d,0)
            }
            break
        }
        
    }
    its++ 
}

function testStep(pos, action){

    transProbs = transitionFunction(action,pos)
    let reward = 0 
    let nextS = []
    //Make cumulative distribution
    cumulativeP = 0
    for(let i=0;i<transProbs.length;i++){
        cumulativeP +=transProbs[i][1]
        transProbs[i][1] = cumulativeP
    }

    //Take action, take chances
    dieRoll = Math.random()
    
    for(let i=0;i<transProbs.length;i++){
        if(dieRoll<transProbs[i][1]){
            reward = transProbs[i][2]
            nextS = transProbs[i][0]            
            break
        }
    }
    return [nextS,reward]
}


////////////
//Animation
////////////

let updateFunction = updateValues
if(qLearn){updateFunction = updateQValuesEG}

learning = 0
function learn(){
    if(!learning){
        learnAnimation = setInterval(function (){updateFunction()},1000/fps)
        learnButton.attr("fill","rgba(0,128,0,.25)")
        learning = 1
    }else{
        clearInterval(learnAnimation)
        learnButton.attr("fill","rgba(0,0,0,.25)")
        learning = 0 
    }
}


