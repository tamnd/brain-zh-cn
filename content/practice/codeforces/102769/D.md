---
title: "CF 102769D - 保卫城市"
description: "城市是一个从(0,0)到(n+1,n+1)的正方形区域。 每个防御塔位于正方形内的整数坐标处，并保护从其位置延伸的四个象限之一。"
date: "2026-07-30T04:26:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102769
codeforces_index: "D"
codeforces_contest_name: "2020 China Collegiate Programming Contest Qinhuangdao Site"
rating: 0
weight: 102769
solve_time_s: 96
verified: true
draft: false
---

[CF 102769D - 保卫城市](https://codeforces.com/problemset/problem/102769/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该城市是一个正方形区域`(0,0)`到`(n+1,n+1)`。 每个防御塔位于正方形内的整数坐标处，并保护从其位置延伸的四个象限之一。 东北塔保护其右侧和上方的所有物体，西北塔保护其左侧和上方的所有物体，西南塔保护其左侧和下方的所有物体，东南塔保护其右侧和下方的所有物体。 

任务是选择尽可能最小的一组塔楼，其保护区覆盖整个城市。 如果不存在这样的集合，则答案是不可能的。 

坐标很大，所有测试用例中的塔总数达到数百万。 这立即排除了检查所有塔对或模拟整个塔的方法`n x n`城市。 甚至一个`O(n log n)`方法需要谨慎，并且每个测试用例的预期解决方案必须是线性的。 

第一个观察是城市的四个角迫使所有四个方向的存在。 左下角只能被西南塔覆盖，左上角只能被西北塔覆盖，右上角只能被东北塔覆盖，右下角只能被东南塔覆盖。 

如果仅检查所有四个方向是否存在，幼稚的实现可能会失败。 例如：```
1
4
1 1 1
1 4 2
4 4 3
4 1 4
```四个角被四座塔覆盖，但中心区域没有。 答案不是`4`因为所选的象限留下了一个大的未覆盖的矩形。 

另一个陷阱是假设占据每个方向最近的塔总是最佳的。 例如，同一方向的两座塔可以形成阶梯状的边界。 拆除其中一个可能会暴露出没有任何一个替换塔覆盖的区域。 

该解决方案需要推理这些楼梯边界而不是单个塔楼。 

## 方法

 直接的方法是尝试塔的子集。 这是正确的，因为任何有效答案都是可用塔的子集，但子集的数量是指数级的。 即使将搜索限制为四个或五个塔的组合也是不够的，因为在特殊构造的情况下，答案可能需要更多的塔。 

有用的结构来自于观察未覆盖的区域。 对于问题的一个方向，考虑所有西南塔。 他们的结合创造了一个楼梯边界。 只有这个楼梯的角落很重要。 如果该楼梯的一个角落已经被另一个方向覆盖，则不需要为该角落提供贡献的西南塔楼之一。 否则，每个剩余的楼梯角都必须由东北塔保护。 

这一观察结果将问题简化为遵循可能的阶梯状态。 每个状态都由单个边界坐标描述，这允许使用前缀和后缀信息进行线性扫描。 

实施解决一个方向，进而体现整个城市。 反射处理重要楼梯位于另一侧的对称情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 以标准化方向存放塔。 方向被转换为四种状态，以便第一遍处理几何体的一侧。 
2. 构建描述最强相关塔边界的前缀和后缀数组。 例如，对于西南塔楼，我们保留最低可达的塔楼`y`每个人的价值`x`，而对于西北和东北的塔楼，我们保持最大可达性`x`价值观。 
3. 将西南楼梯压缩为可能的过渡状态。 过渡表示从一个楼梯角移动到另一个楼梯角，并记录所需的额外塔的最小数量。 
4. 扫描可能的楼梯位置。 扫描会保留每个活动边界的最佳答案，因为未来的选择仅取决于当前边界的一个坐标。 
5. 检查所有可能的最终楼梯端点并更新塔的最小数量。 
6. 反映坐标和方向并重复相同的计算。 反射覆盖了第一方向未表示的对称情况。 
7. 如果两个方向都找不到有效的构造，则输出`Impossible`。 

为什么它有效：

 重要的不变量是，在处理楼梯边界后，每个可能的最佳部分解都由一个存储的状态表示。 楼梯上任何未使用的塔只能通过改变边界的角落发挥作用。 扫描保持了到达每个这样的角落的最便宜的方式，因此当找到完整的覆盖配置时，塔的数量是最少的。 反射步骤处理唯一剩余的对称性，因此不会错过任何几何情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10 ** 9

def calc(n, x, y, d):
    mny = [INF] * (n + 2)
    Mxx = [0] * (n + 2)
    mxx = [0] * (n + 2)
    mxy = [0] * (n + 2)

    for i in range(n):
        if d[i] == 0:
            mny[x[i]] = min(mny[x[i]], y[i])
        elif d[i] == 1:
            Mxx[y[i]] = max(Mxx[y[i]], x[i])
        elif d[i] == 2:
            mxx[y[i]] = max(mxx[y[i]], x[i])
        else:
            mxy[x[i]] = max(mxy[x[i]], y[i])

    for i in range(2, n + 1):
        mny[i] = min(mny[i - 1], mny[i])
        Mxx[i] = max(Mxx[i - 1], Mxx[i])
        mxy[i] = max(mxy[i - 1], mxy[i])

    for i in range(n - 1, 0, -1):
        mxx[i] = max(mxx[i + 1], mxx[i])

    fx = [INF] * (n + 2)
    fy = [INF] * (n + 2)

    for i in range(n):
        if d[i] == 1:
            x0 = x[i]
            y0 = mny[min(x0, Mxx[y[i]])]
            if y0 > y[i]:
                continue
            if y0 <= mxy[x0]:
                return 4
            fx[x0] = min(fx[x0], 3 + (y0 > mny[x0]))
            fy[y0] = min(fy[y0], 3 + (x0 < mxx[y0]))

    ans = INF
    yy = n

    for xx in range(1, n + 1):
        while yy > mny[xx]:
            if mxx[yy]:
                fx[mxx[yy]] = min(
                    fx[mxx[yy]],
                    fy[yy] + (yy > mny[mxx[yy]])
                )
            yy -= 1
        if mny[xx] != INF:
            fy[mny[xx]] = min(
                fy[mny[xx]],
                fx[xx] + (xx < mxx[mny[xx]])
            )

    while yy:
        if mxx[yy]:
            fx[mxx[yy]] = min(
                fx[mxx[yy]],
                fy[yy] + (yy > mny[mxx[yy]])
            )
        yy -= 1

    for xx in range(1, n + 1):
        if mny[xx] <= mxy[xx]:
            ans = min(ans, fx[xx] + 1)

    for yy in range(1, n + 1):
        if mxx[yy] and yy <= mxy[mxx[yy]]:
            ans = min(ans, fy[yy] + 1)

    return ans

def solve_case(n, towers):
    x = []
    y = []
    d = []

    for a, b, c in towers:
        x.append(a)
        y.append(b)
        d.append(c - 1)

    ans = calc(n, x, y, d)

    for i in range(n):
        y[i] = n - y[i] + 1
        d[i] ^= 3

    ans = min(ans, calc(n, x, y, d))

    return "Impossible" if ans > n else str(ans)

def main():
    t = int(input())
    out = []

    for case in range(1, t + 1):
        n = int(input())
        towers = []
        for _ in range(n):
            x, y, d = map(int, input().split())
            towers.append((x, y, d))
        out.append(f"Case #{case}: {solve_case(n, towers)}")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```这`calc`核心功能是扫频。 数组`mny`,`mxy`,`mxx`， 和`Mxx`存储尽可能好的楼梯边界。 前缀和后缀传播使有关一系列塔的每个查询的时间恒定。 

两个数组`fx`和`fy`代表以特定楼梯坐标结束的最便宜的部分构造。 当扫描通过边界时，状态可以转移到下一个边界，但需要额外的塔成本。 

第二次致电`calc`变化`y`进入`n-y+1`并用 XOR 翻转方向`3`。 这是一种垂直镜像正方形并重复使用相同几何推理的紧凑方法。 

没有浮点运算。 坐标是整数网格位置，所有计数器的边界为`n`，所以普通的 Python 整数就足够了。 

## 工作示例

 对于第一个样本：```
2
3
1 1 1
2 2 2
3 3 3
4
1 1 1
2 2 3
2 1 2
1 2 4
```第一个测试仅包含三座塔。 

| 步骤| 主动方向 | 结果 |
 | ---| ---| ---|
 | 阅读塔 | 东北、西北、西南 | 缺少SE |
 | 检查第一方向 | 无法覆盖右下角| 不可能|
 | 检查反射 | 仍然缺少所需的方向 | 不可能|

 第二个测试有所有四个方向。 

| 步骤| 主动方向 | 结果 |
 | ---| ---| ---|
 | 建造楼梯| 所有界限都存在| 继续 |
 | 扫一扫状态 | 每个未覆盖的角落都有一座塔| 4 |
 | 反思| 没有更好的解决方案| 保留 4 |

 这些痕迹说明了为什么四个方向是必要的以及为什么四个塔仍然是最少的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个塔和每个坐标在两次传递中都会处理固定次数 |
 | 空间| O(n) | 该算法存储多个按坐标索引的数组 |

 所有测试用例中的塔总数是有限的，因此线性解决方案可以轻松满足内存和时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    t = int(next(it))
    out = []

    for case in range(1, t + 1):
        n = int(next(it))
        towers = []
        for _ in range(n):
            towers.append((int(next(it)), int(next(it)), int(next(it))))
        out.append(f"Case #{case}: {solve_case(n, towers)}")

    return "\n".join(out)

assert run("""2
3
1 1 1
2 2 2
3 3 3
4
1 1 1
2 2 3
2 1 2
1 2 4
""") == """Case #1: Impossible
Case #2: 4"""

assert run("""1
1
1 1 1
""") == "Case #1: Impossible"

assert run("""1
4
2 2 1
2 2 2
2 2 3
2 2 4
""") == "Case #1: 4"

assert run("""1
8
1 8 1
2 8 1
8 8 2
8 7 2
8 1 3
7 1 3
1 1 4
1 2 4
""") == "Case #1: 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一塔| 不可能| 缺少三个角方向 |
 | 一处四塔 | 4 | 尽可能最小的覆盖结构|
 | 多个塔楼形成外部边界| 4 | 冗余塔被忽略|

 ## 边缘情况

 一座只有一座塔的城市是无法运作的，因为一个象限无法覆盖所有四个角。 该算法捕获了这一点，因为所需的楼梯状态永远不会完成。 

具有所有四个方向但塔距离较远的情况也可以正确处理。 例如，广场角落的四座塔楼中央留有一个洞。 扫描检测到需要额外的塔或不同的选择，而不是假设四个方向意味着四个塔就足够了。 

对称布局从一个方向看起来可能有效，但在第一次扫描期间会失败。 反射的第二遍检查相反的楼梯方向并防止遗漏此类情况。
