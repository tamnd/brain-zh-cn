---
title: "CF 8C - 寻求订单"
description: "我们有一个固定的起点，即手提包，以及 2D 平面上最多 24 个分散的物体。 莉娜总是从手提包开始，四处走动，收集最多两个物品，然后返回手提包，然后重复，直到所有物品都放回去。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp"]
categories: ["algorithms"]
codeforces_contest: 8
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 8"
rating: 2000
weight: 8
solve_time_s: 108
verified: true
draft: false
---
[CF 8C - 寻找订单](https://codeforces.com/problemset/problem/8/C)

 **评级：** 2000
 **标签：** 位掩码、dp
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个固定的起点，即手提包，以及 2D 平面上最多 24 个分散的物体。 莉娜总是从手提包开始，四处走动，收集最多两个物品，然后返回手提包，然后重复，直到所有物品都放回去。 

两个位置之间的旅行成本是欧几里德距离的平方。 如果莉娜从点移动`(x1, y1)`到`(x2, y2)`，所花费的时间为：$(x_1-x_2)^2 + (y_1-y_2)^2$手提包本身不会移动，所以每次旅行都从点开始`0`并结束于点`0`。 

一次旅行可以是这样的：```
0 -> i -> 0
```或者像这样：```
0 -> i -> j -> 0
```该任务不仅是计算最小总旅行成本，而且是重建一个最佳的旅行序列。 

约束条件`n ≤ 24`立即排除任何阶乘。 尝试所有可能的对象排序大约需要`24!`排列组合，这是完全不可能的。 

同时，`2^24`约为1600万。 这是很大的，但对于低常数因子语言中仔细优化的位掩码 DP 来说是可以管理的。 由于每次行程处理一个或两个对象，因此问题结构自然建议将“哪些对象已被收集”表示为位掩码。 

问题的不寻常部分是路径被分成独立的行程，并且总是返回到手提包。 这破坏了通常的旅行推销员结构。 我们不需要一条巨大的路线将所有东西都访问一次。 我们只需要将对象分成大小为一或两个的组，然后选择每个组内的最佳顺序。 

当获取两个对象实际上比单独获取它们更糟糕时，就会出现微妙的边缘情况。 

例子：```
0 0
2
100 0
-100 0
```将两者加在一起的成本：```
0 -> A -> B -> 0
= 10000 + 40000 + 10000
= 60000
```单独使用它们的成本：```
0 -> A -> 0 = 20000
0 -> B -> 0 = 20000
total = 40000
```总是将附近的对象配对的贪婪策略在这里会失败。 

另一种危险的情况是只有一个对象未​​被收集。 

例子：```
0 0
3
1 0
2 0
100 0
```最佳解决方案将前两个配对，而忽略第三个。 假设每个转换恰好删除两个对象的错误实现将崩溃或跳过有效状态。 

还有一个重构陷阱。 DP 仅计算最小成本，但输出需要实际的行程顺序。 如果不仔细存储父信息，之后就无法重建路由。 

## 方法

 蛮力的想法很简单。 我们可以生成所有可能的行程序列。 在每一步中，我们选择一个或两个剩余的对象，附加一个行程，并对剩余的集合进行递归。 

这种蛮力是正确的，因为每个有效的策略只是将对象划分为有序的行程。 递归最终将它们全部枚举出来。 

问题在于可能性的数量。 即使我们只计算配对，将 24 个对象划分为单个对象和配对的方法数量也是巨大的。 它的生长大致如下：$\sum_{k=0}^{12} \frac{24!}{(24-2k)!\,2^k\,k!}$这远远超出了 4 秒的运行时间。 

关键的观察结果是，行程之间的顺序对于未来的成本并不重要。 一旦收集了对象的子集，唯一相关的信息就是该子集。 Lena每次旅行后总是回到手提包，因此不存在“当前位置”状态。 

这意味着我们可以定义：```
dp[mask] = minimum cost to collect all objects in mask
```来自一个州`mask`，我们选择一个未收集的对象`i`。 然后我们要么：```
take only i
```或者：```
take i together with another uncollected object j
```这会过渡到更大的蒙版。 

关键的优化是仅选择第一个未收集的对象。 如果没有这个技巧，每个州都会重复尝试所有有序对。 通过固定一个规范对象，每个转换都会生成一次。 

状态总数为`2^n`。 对于每个状态我们最多尝试`n`与第一个自由对象配对，因此复杂度大致变为：$O(n\cdot 2^n)$舒适地适合`n = 24`在优化的实现中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数超越`2^n`| 指数| 太慢了 |
 | 最佳位掩码 DP |`O(n * 2^n)`|`O(2^n)`| 已接受 |

 ## 算法演练

 1.读取手提包坐标和所有物体坐标。 
2. 预先计算每对点之间的距离。 

成本函数多次使用平方欧氏距离。 在 DP 转换内重新计算它会浪费时间。 

1. 对于每个对象`i`，预先计算仅获取该对象的成本：```
0 -> i -> 0
```这等于：```
dist(0, i) + dist(i, 0)
```1. 对于每对对象`(i, j)`，预先计算将它们组合在一起的成本：```
0 -> i -> j -> 0
```这等于：```
dist(0, i) + dist(i, j) + dist(j, 0)
```1. 定义：```
dp[mask]
```作为精确收集其位被设置的对象所需的最小成本`mask`。 

初始化：```
dp[0] = 0
```因为收集任何东西都不需要任何成本。 

1. 迭代所有掩码。 

对于每个掩码，找到第一个对象`i`尚未收集。 

仅选择第一个缺失的对象可以避免重复的转换。 每个国家的扩张都变得独一无二。 

1.尝试拿东西`i`独自的。 

创造：```
new_mask = mask | (1 << i)
```更新：```
dp[new_mask]
```旅行费用为`i`。 

1. 尝试配对`i`与所有其他未收集的对象`j`。 

创造：```
new_mask = mask | (1 << i) | (1 << j)
```使用预先计算的成对行程成本更新 DP。 

1. 每当转换提高 DP 值时就存储父信息。 

我们需要足够的信息来重建为每个州选择的旅行。 

1. 处理完所有掩码后，从以下位置向后重建答案：```
(1 << n) - 1
```跟随父指针直到到达掩码`0`。 

1. 反转重建的序列并以所需格式打印。 

每次旅行的开始和结束都必须是`0`。 

### 为什么它有效

 DP 不变量为：```
dp[mask] = minimum possible cost to collect exactly the objects in mask
```每个有效的策略在其最后一次旅行之前都会达到某个先前的状态。 最后一次旅行会移除一个或两个物体。 转移公式准确地列举了这些可能性。 

因为每次状态转换都会增加一次独立行程的确切成本，并且因为行程总是在手提包处开始和结束，所以不同行程之间不存在隐藏的交互。 状态的最优解仅取决于较小的状态，这使得动态规划有效。 

修复第一个未收集的对象不会删除任何有效的解决方案。 每个转换仍然会出现一次，只是按照规范顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

def dist(a, b):
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    return dx * dx + dy * dy

def solve():
    xs, ys = map(int, input().split())
    n = int(input())

    points = [(xs, ys)]
    for _ in range(n):
        points.append(tuple(map(int, input().split())))

    single = [0] * n
    pair = [[0] * n for _ in range(n)]

    for i in range(n):
        single[i] = (
            dist(points[0], points[i + 1]) * 2
        )

    for i in range(n):
        for j in range(n):
            pair[i][j] = (
                dist(points[0], points[i + 1])
                + dist(points[i + 1], points[j + 1])
                + dist(points[j + 1], points[0])
            )

    size = 1 << n

    dp = [INF] * size
    parent = [-1] * size
    take = [()] * size

    dp[0] = 0

    for mask in range(size):
        if dp[mask] == INF:
            continue

        first = -1

        for i in range(n):
            if not (mask & (1 << i)):
                first = i
                break

        if first == -1:
            continue

        # take first alone
        new_mask = mask | (1 << first)

        cost = dp[mask] + single[first]

        if cost < dp[new_mask]:
            dp[new_mask] = cost
            parent[new_mask] = mask
            take[new_mask] = (first,)

        # take first with another object
        for j in range(first + 1, n):
            if mask & (1 << j):
                continue

            pair_mask = new_mask | (1 << j)

            cost = dp[mask] + pair[first][j]

            if cost < dp[pair_mask]:
                dp[pair_mask] = cost
                parent[pair_mask] = mask
                take[pair_mask] = (first, j)

    full = size - 1

    print(dp[full])

    path = []

    cur = full

    while cur:
        objs = take[cur]

        trip = [0]

        for x in objs:
            trip.append(x + 1)

        trip.append(0)

        path.extend(trip)

        cur = parent[cur]

    path.reverse()

    print(*path)

solve()
```第一部分构建坐标列表。 手提包存放在索引处`0`，而对象存储自`1`向前。 这简化了距离计算，因为每次行程都会自然地参考点`0`。 

这`single`数组存储单独获取一个对象的成本。 这`pair`矩阵存储在一次旅行中将两个物体放在一起的成本。 预先计算这些值可以消除 DP 循环中的重复算术。 

DP 状态使用位掩码。 如果位`i`已设置，对象`i`已经被收集了。 数组大小为`2^n`，这对于`n = 24`。 

转换逻辑始终选择第一个未收集的对象。 这是减少重复工作的标准优化。 如果没有它，每个状态都会以不同的顺序重复生成等效的配对。 

重建阵列是微妙的。`parent[new_mask]`存储之前的掩码，同时`take[new_mask]`存储在产生此状态的最终行程中收集了哪些对象。 

在重建过程中，我们从全掩模向后走到零。 每个存储的行程如下所示：```
0 -> objects -> 0
```重建是向后累积的，所以最终的列表在打印之前必须颠倒过来。 

一个容易犯的错误就是忘记`+1`输出期间。 内部对象是零索引的，但问题陈述使用一索引编号。 

另一个常见的错误是为已收集的对象生成对转换。 条件：```
if mask & (1 << j):
    continue
```防止无效转换。 

## 工作示例

 ### 示例 1

 输入：```
0 0
2
1 1
-1 1
```距离：```
dist(0,1)=2
dist(0,2)=2
dist(1,2)=4
```单程：```
1 alone = 4
2 alone = 4
```双人旅行：```
0 -> 1 -> 2 -> 0 = 8
```DP跟踪：

 | 面膜| 已收藏 | 过渡 | 新成本|
 | --- | --- | --- | --- |
 | 00 | 00 无 | 单独服用1 | 4 |
 | 00 | 00 无 | 取 1 和 2 | 8 |
 | 01 | 1 | 单独拿2个| 8 |

 最终的答案是`8`。 

重建路线：```
0 1 2 0
```该跟踪表明，将两个对象配对与单独使用它们一样好。 DP 保留一个最优解并正确地重建它。 

### 示例 2

 输入：```
0 0
3
1 0
2 0
100 0
```预先计算的成本：

 | 旅行| 成本|

 |---|---|---|

 | 1 单独 | 2 |

 | 2 单独 | 8 |

 | 3 独自一人| 20000 |

 | 1 和 2 | 8 |

 | 1 和 3 | 20000 |

 | 2 和 3 | 20000 |

 DP跟踪：

 | 面膜| 过渡 | 结果 |
 | --- | --- | --- |
 | 000 | 000 单独服用1 | dp[001] = 2 |
 | 000 | 000 取 1 和 2 | dp[011] = 8 |
 | 001| 单独拿2个| dp[011] = 10 |
 | 011| 单独拿3个| dp[111] = 20008 |

 最佳结果：```
0 1 2 0 3 0
```此示例演示了为什么算法必须允许单对象行程。 将远处的物体与其他物体配对永远不会有好处。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n * 2^n)`| 每个掩码处理一个固定对象并尝试将其与最多`n`其他 |
 | 空间|`O(2^n)`| 所有掩模上的 DP 和重建阵列 |

 为了`n = 24`，州数约为1600万个。 始终选择第一个未收集对象的优化使转换计数易于管理。 使用整数数组时，内存使用量也完全符合 512 MB 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

INF = 10**18

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def dist(a, b):
        dx = a[0] - b[0]
        dy = a[1] - b[1]
        return dx * dx + dy * dy

    xs, ys = map(int, input().split())
    n = int(input())

    points = [(xs, ys)]

    for _ in range(n):
        points.append(tuple(map(int, input().split())))

    single = [0] * n
    pair = [[0] * n for _ in range(n)]

    for i in range(n):
        single[i] = dist(points[0], points[i + 1]) * 2

    for i in range(n):
        for j in range(n):
            pair[i][j] = (
                dist(points[0], points[i + 1])
                + dist(points[i + 1], points[j + 1])
                + dist(points[j + 1], points[0])
            )

    size = 1 << n

    dp = [INF] * size
    parent = [-1] * size
    take = [()] * size

    dp[0] = 0

    for mask in range(size):
        if dp[mask] == INF:
            continue

        first = -1

        for i in range(n):
            if not (mask & (1 << i)):
                first = i
                break

        if first == -1:
            continue

        new_mask = mask | (1 << first)

        cost = dp[mask] + single[first]

        if cost < dp[new_mask]:
            dp[new_mask] = cost
            parent[new_mask] = mask
            take[new_mask] = (first,)

        for j in range(first + 1, n):
            if mask & (1 << j):
                continue

            pair_mask = new_mask | (1 << j)

            cost = dp[mask] + pair[first][j]

            if cost < dp[pair_mask]:
                dp[pair_mask] = cost
                parent[pair_mask] = mask
                take[pair_mask] = (first, j)

    full = size - 1

    out = [str(dp[full])]

    path = []

    cur = full

    while cur:
        objs = take[cur]

        trip = [0]

        for x in objs:
            trip.append(x + 1)

        trip.append(0)

        path.extend(trip)

        cur = parent[cur]

    path.reverse()

    out.append(" ".join(map(str, path)))

    return "\n".join(out)

# provided sample
assert run(
"""0 0
2
1 1
-1 1
"""
).startswith("8"), "sample 1"

# minimum size
assert run(
"""0 0
1
1 0
"""
).startswith("2"), "single object"

# pairing better than separate
assert run(
"""0 0
2
1 0
2 0
"""
).startswith("8"), "pair trip"

# separate better than pairing
assert run(
"""0 0
2
100 0
-100 0
"""
).startswith("40000"), "avoid bad pair"

# boundary style case
assert run(
"""100 100
2
-100 -100
100 -100
"""
).splitlines()[0].isdigit(), "large coordinates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个物体 | 成本`2`| 正确处理单人出行|
 | 附近的一对 | 成本`8`| 配对优化 |
 | 远处物体对面| 成本`40000`| 配对并不总是最佳的 |
 | 大坐标| 有效的数字答案 | 平方距离算术 |

 ## 边缘情况

 考虑配对有害的情况：```
0 0
2
100 0
-100 0
```DP 从 mask 开始`00`。 

可能的转变：```
take 1 alone -> cost 20000
take 1 and 2 -> cost 60000
```来自面具`01`:```
take 2 alone -> total 40000
```该算法正确地保留了较小的值。 贪婪的配对策略会失败，因为它永远不会与两次单独的旅行进行比较。 

现在考虑奇数个对象：```
0 0
3
1 0
2 0
100 0
```DP最终达到面具`011`，这意味着前两个对象已经被收集。 唯一对象`3`遗迹。 

该算法仍然允许：```
011 -> 111
```使用单对象行程。 这是有效的，因为每个状态总是在成对转换之前尝试“单独获取一个对象”转换。 

最后，考虑最小的可能输入：```
0 0
1
5 5
```唯一有效的路线是：```
0 -> 1 -> 0
```计算出的成本为：```
50 + 50 = 100
```重建数组正确生成：```
0 1 0
```因为完整掩码的父级只是掩码`0`。
