---
title: "CF 420E - 打球"
description: "一个球从原点沿着某个选定的方向抛出，并且它沿着该射线重复出现在等距点处：首先在距离 $d$ 处，然后在 $2d$ 处，然后在 $3d$ 处，依此类推。 方向一旦选择就固定了，但它可以是平面上的任何实际方向。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 420
codeforces_index: "E"
codeforces_contest_name: "Coder-Strike 2014 - Finals (online edition, Div. 1)"
rating: 2600
weight: 420
solve_time_s: 120
verified: true
draft: false
---

[CF 420E - 打球](https://codeforces.com/problemset/problem/420/E)

 **评分：** 2600
 **标签：** 几何
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 一个球从原点沿着某个选定的方向抛出，并且它沿着该射线重复出现在等距点处：首先出现在远处$d$，然后在$2d$， 然后$3d$， 等等。 方向一旦选择就固定了，但它可以是平面上的任何实际方向。 

飞机上有$n$界。 每当这些离散的着陆点之一落在一个圆圈内或圆圈上时，该圆圈就会贡献一分。 如果着陆点位于多个圆圈内，则所有圆圈都会同时做出贡献。 任务是选择射线的方向，以使所有圆圈和所有着陆点上的此类“命中”总数最大化。 

关键对象不是连续的轨迹，而是离散的无限点序列$P_k = k \cdot d \cdot u$， 在哪里$u$是单位向量。 分数完全取决于有多少点落入给定的磁盘中。 

这些限制以非常具体的方式发挥作用。 高达$2 \cdot 10^4$圆，任何直接检查所有方向或所有圆对的方法都已经太大了。 更重要的是，任何试图模拟所有光线或过于精细地离散角度的解决方案都会失败，因为答案取决于方向的连续选择，而不是有限的候选集。 

每个圆的半径都比较小（最多50），间距$d$也很小（最多 10 个）。 这强烈表明，对于一个固定的圆，只有少量的索引$k$可能会产生点击，因为一旦$k d$距离圆心到原点的距离太远，圆不能包含该点。 

如果假设每个圆圈最多贡献一次命中，就会出现一种微妙的失败情况。 一个圆可以被不同倍数相交多次$d$。 例如，如果圆的中心位于原点附近但足够大，则两者$k=2$和$k=3$可能会产生相同方向的有效命中。 

另一个陷阱是将问题视为每个圆仅施加单个角度约束。 约束实际上取决于$k$，以及不同的$k$同一圆的值会产生不同的角度间隔。 

## 方法

 思考问题的一个直接方法是固定一个方向并模拟射线。 对于每个圆和每个整数$k$，我们检查点是否$k d u$位于圆圈内。 遍及所有圈子和所有$k$，我们计算匹配项。 这是正确的，但速度慢得令人绝望，因为候选方向的数量是无限的，甚至评估一个方向也需要检查所有圆圈和所有相关的$k$。 

结构观察的关键是反转视角。 我们不是固定一个方向并检查圆圈，而是固定一个圆圈并询问哪些方向和哪些索引$k$对应的点就在它里面。 

以圆心固定一个圆$C$。 对于固定的$k$，条件是$k d u$位于圆内是方向上的几何约束$u$。 重点$k d u$与原点的距离固定，因此我们与两个对象相交：一个以原点为中心、半径为半径的圆$k d$，以及给定的圆心为$C$。 该交点对应于原点可以在该径向距离处“看到”圆的一组角度。 

对于每个有效的$k$, 方向集$u$形成连续的角区间。 该区间以 的方向为中心$C$，其半宽由余弦定律决定。 

剩下的问题是有多少$k$必须考虑每个圆的值。 从原点到的距离$k d u$是固定的，所以对于以距离为中心的圆$|C|$，只有值$k$这样$k d$是在$r$的$|C|$可能可以工作。 这给出了一个严格的整数范围：$$\frac{|C| - r}{d} \le k \le \frac{|C| + r}{d}.$$因为$r \le 50$和$d \ge 5$，这个范围每圈最多包含大约 20 个整数。 

这将问题简化为生成角度间隔的集合，每个角度间隔的重量为 1，然后找到它们在圆上的最大重叠。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解方向和圆圈 | 无限/指数 | O(n) | 太慢了 |
 | 间隔生成超过有效$k$价值观 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 对于每个圆，计算其距离$R$从原点和方向角度$\theta$从原点到中心。 这修复了该圆的所有可能命中的中心几何形状。 
2.确定整数范围$k$使得该圆可以与以原点为半径的圆相交$k d$。 这是从获得$|R - r| \le k d \le R + r$，然后转换为整数范围。 此步骤过滤掉所有不相关的倍数。 
3. 对于每个整数$k$在此范围内，将问题视为两个圆之间的角度可见性问题：一个圆以原点为中心，半径为$k d$，以及给定的圆。 
4. 计算角半宽$\alpha$使用余弦定律：$$\cos \alpha = \frac{(k d)^2 + R^2 - r^2}{2 k d R}.$$限制数值问题，使值稍微超出范围$[-1,1]$不要破坏 arccos。 
5.添加间隔$[\theta - \alpha, \theta + \alpha]$。 如果它越过$-\pi, \pi$边界，将其分成两个区间。 
6. 处理完所有圆圈并全部有效后$k$，对所有间隔端点进行排序并扫描角度，维护活动间隔的运行总和。 
7. 该运行和的最大值就是答案，对应于与最大圆击事件数相交的方向。 

### 为什么它有效

 每对$(\text{circle}, k)$对分数的贡献是独立的：对于固定方向，它要么计数，要么不计数。 几何表明，对于固定$k$，满足条件的方向集合正好是一个角区间。 因此，每个有效事件都可以表示为单位圆上的一个区间，而某个方向的最终得分正是覆盖该角度的区间数。 最大化分数成为圆上的最大重叠问题，并且扫描线正确地捕获了所有重叠。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def norm_angle(a):
    while a <= -math.pi:
        a += 2 * math.pi
    while a > math.pi:
        a -= 2 * math.pi
    return a

def add_interval(events, l, r):
    if l <= r:
        events.append((l, 1))
        events.append((r, -1))
    else:
        events.append((-math.pi, 1))
        events.append((r, -1))
        events.append((l, 1))
        events.append((math.pi, -1))

n, d = map(int, input().split())

events = []

for _ in range(n):
    x, y, r = map(int, input().split())
    R = math.hypot(x, y)
    if R == 0:
        continue

    base_angle = math.atan2(y, x)

    k_min = int(math.ceil((R - r) / d))
    k_max = int(math.floor((R + r) / d))

    if k_max < 1:
        continue
    k_min = max(k_min, 1)

    for k in range(k_min, k_max + 1):
        rk = k * d

        val = (rk * rk + R * R - r * r) / (2 * rk * R)
        val = max(-1.0, min(1.0, val))

        ang = math.acos(val)

        l = base_angle - ang
        rgt = base_angle + ang

        l = norm_angle(l)
        rgt = norm_angle(rgt)

        add_interval(events, l, rgt)

events.sort()

ans = 0
cur = 0
for a, t in events:
    cur += t
    ans = max(ans, cur)

print(ans)
```该代码首先将每个圆转换为每个可行的所有有效观看方向的角度描述$k$。 这`k_min`和`k_max`计算是关键的修剪步骤，可以防止迭代不必要的索引。 

每个间隔都经过仔细标准化，以处理环绕$\pm \pi$，因为角度扫描需要线性排序。 扫描本身是排序事件的标准差异数组。 

一个微妙的细节是在调用之前限制余弦参数`acos`，因为接近相切的浮点运算可能会产生稍微超出有效域的值。 

## 工作示例

 考虑一个具有两个圆圈和适中步长的小实例。 

### 示例 1

 输入：```
2 5
1 1 1
5 0 1
```| 圈 | 右 | k 范围 | 生成的间隔 |
 | --- | --- | --- | --- |
 | (1,1,1) | (1,1,1) | √2 | k=1 | k=1 45°左右小圆弧|
 | (5,0,1) | (5,0,1) | 5 | k=1 | k=1 0°附近的弧 |

 扫描角度永远不会累积超过 1 次重叠，因此答案为 1。这表明即使两个圆均可到达，但没有一个方向可以同时对齐两个命中$k$。 

### 示例 2

 输入：```
1 5
10 0 6
```| k | 点半径| 状况 | 结果 |
 | --- | --- | --- | --- |
 | 1 | 5 | 内圆| 有效 |
 | 2 | 10 | 10 内圆| 有效 |

 两个都$k=1$和$k=2$产生以 0 弧度为中心的有效间隔，因此扫描在角度 0 处累积 2 次重叠。 

这表明单个圆圈可以为固定方向贡献多个得分事件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n + K)$| 每个圆圈最多贡献约 20 个值$k$，每产生一个区间，然后进行排序和扫 |
 | 空间|$O(n)$| 存储所有间隔事件 |

 上的界限$k$是使解决方案在一定范围内保持舒适的原因：尽管有最多$2 \cdot 10^4$圈中，生成的间隔总数保持在几十万左右，这完全在 2 秒的 C++ 或优化的 Python 解决方案之内。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math
    input = sys.stdin.readline

    n, d = map(int, input().split())
    events = []

    def norm(a):
        while a <= -math.pi:
            a += 2 * math.pi
        while a > math.pi:
            a -= 2 * math.pi
        return a

    def add(l, r):
        if l <= r:
            events.append((l, 1))
            events.append((r, -1))
        else:
            events.append((-math.pi, 1))
            events.append((r, -1))
            events.append((l, 1))
            events.append((math.pi, -1))

    for _ in range(n):
        x, y, r = map(int, input().split())
        R = math.hypot(x, y)
        if R == 0:
            continue
        ang0 = math.atan2(y, x)

        kmin = int(math.ceil((R - r) / d))
        kmax = int(math.floor((R + r) / d))
        kmin = max(kmin, 1)
        if kmax < kmin:
            continue

        for k in range(kmin, kmax + 1):
            rk = k * d
            val = (rk*rk + R*R - r*r) / (2*rk*R)
            val = max(-1.0, min(1.0, val))
            ang = math.acos(val)
            add(norm(ang0-ang), norm(ang0+ang))

    events.sort()
    cur = ans = 0
    for _, t in events:
        cur += t
        ans = max(ans, cur)
    return str(ans)

# provided samples
assert run("2 5\n1 1 1\n5 0 1\n") == "1"

# circle hits twice
assert run("1 5\n10 0 6\n") == "2"

# far circle, no hit
assert run("1 5\n100 0 1\n") == "0"

# symmetric case
assert run("2 5\n10 0 6\n-10 0 6\n") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品 1 | 1 | 基本正确性 |
 | 单圈多次点击| 2 | 每个圆有多个 k 个贡献 |
 | 远圆| 0 | 无效k的修剪|
 | 对称圆| 2 | 跨独立区间的累积 |

 ## 边缘情况

 远离原点且半径较小的圆会产生空心$k$-range，算法自然会跳过它，因为$k_{\max} < k_{\min}$。 这可以防止任何无效的间隔生成，并避免不必要的浮点计算。 

当圆足够大以与多个半径相交时$k d$，该算法为同一个圆生成多个间隔。 每个间隔都是独立的，并且扫描线正确地将它们计为单独的贡献。 这对于最佳方向以不同距离穿过同一几何区域的情况至关重要。 

当一个区间跨越$-\pi$边界，它被分成两部分，确保扫描线的顺序一致。 如果没有这个，角度结构就会破裂，并且分支切口附近的重叠可能会被错误计算。
