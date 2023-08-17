//容器元素
const containerEl = document.querySelector(".container")
//所有容器中的卡片位置元素
const cardsPositionsEl = containerEl.querySelectorAll(".card-position")

//卡片围绕的圆当前角度
let angle = 0;
//卡片围绕的圆周半径
const radius = 500;
//固定摩擦力 摩擦力为固定值
const friction = 0.1;
//空气阻力系数(速度会受到空气阻力的影响，速度越大。空气阻力越大)
const airDragCoefficient = 0.02;
// 角速度绝对值
let absoluteSpeed = 0;
//速度方向 +1为正 -1为负
let speedDirection = +1;
//卡片数量为5+5个(互为镜像)
const cardCount = 5;
//卡片数量为5+5个(互为镜像)
const cardElementCount = cardCount * 2;
//拖动的力量倍数
const forceRatio = 0.2;

const draw = () => {
    cardsPositionsEl.forEach((position, index) => {
        //每一个卡片位置
        const angleOffset = angle + (index) * (360 / cardElementCount);
        position.style.transform = `
        translateZ(-${radius}px) 
        rotateY(${angleOffset}deg) 
        translateZ(${radius}px) 
        rotateY(${-angleOffset * 2}deg)`;//为了转回来一点角度 每张卡片都朝向用户
    })
    if (absoluteSpeed !== 0) {
        //位移=基础位移+绝对速度*速度方向
        angle = angle + absoluteSpeed * speedDirection;
        //速度会由于阻力降低
        absoluteSpeed -= friction + (absoluteSpeed * airDragCoefficient);
        if (absoluteSpeed < 0) {
            //绝对速度不可能为负值
            absoluteSpeed = 0;
        }
    }
    requestAnimationFrame(draw)//由于使用该函数，时间上基本是均匀的
}

draw();

containerEl.addEventListener('mousedown', (event) => {
    //每次点击后重置速度
    absoluteSpeed = 0;
    //初始鼠标x位置
    const startX = event.pageX;
    //卡片圆的初始角度
    const startAngle = angle;
    //给一个上一次回调的x位置
    let lastX = startX;
    //给一个上上次回调的x位置(onUp时间不能区分move导致的)
    let lastlastX = startX;
    //鼠标移动回调
    const onMove = (_event) => {
        const moveX = _event.pageX;
        lastlastX = lastX;
        lastX = moveX;
        angle = startAngle + (moveX - startX) * forceRatio
    }
    //抬起鼠标回调
    const onUp = (_event) => {
        handleEnd(_event);
    }
    //鼠标离开container回调
    const onLeave = (_event) => {
        handleEnd(_event);
    }
    //onUp和onLeave都是停止拖动 统一处理为handleEnd
    const handleEnd = (_event) => {
        const speed = (_event.pageX - lastlastX) * forceRatio;
        if (speed >= 0) {
            speedDirection = 1
        } else {
            speedDirection = -1;
        }
        absoluteSpeed = Math.abs(speed);
        //完成了一次拖动 解绑所有事件
        containerEl.removeEventListener('mousemove', onMove)
        containerEl.removeEventListener('mouseleave', onLeave)
        containerEl.removeEventListener('mouseup', onUp)
    }
    //绑定相关事件
    containerEl.addEventListener('mousemove', onMove)
    containerEl.addEventListener('mouseleave', onLeave)
    containerEl.addEventListener('mouseup', onUp)
})

//移动端请处理ontouchstart ontouchmove ontouchend时间 注意 event中取值时是数组(因为移动设备支持多点触控)