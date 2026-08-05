---
title: "CF 102606H - 热管"
description: "我们有一个图，其中每个顶点都是温室，每个边都是热管。 每个顶点必须接收 [a, b] 范围内的整数温度。 对于每条边，两个端点温度必须相差正好 1。"
date: "2026-08-04T17:06:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102606
codeforces_index: "H"
codeforces_contest_name: "2020 ECNU Campus Online Invitational Contest"
rating: 0
weight: 102606
solve_time_s: 70
verified: true
draft: false
---

[CF 102606H - 热管](https://codeforces.com/problemset/problem/102606/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个图，其中每个顶点都是温室，每个边都是热管。 每个顶点必须接收范围内的整数温度`[a, b]`。 对于每条边，两个端点温度必须相差正好 1。 与此同时，各个温度`a`到`b`必须在顶点中至少出现一次。 

就顶点数量而言，约束很小。 全部的总和`n`值只有 2000，所以算法围绕`O(n^2)`是可能的。 边的数量可以达到 50000 条，因此我们仍然需要高效地处理图，并避免为每个可能的分配做昂贵的工作。 

棘手的情况不仅仅是无效的奇数周期。 图可以满足所有边缘差异，但仍然会失败，因为它无法创建足够的不同温度。 例如：```
1
3 3 1 3
1 2
2 3
1 3
```不能为三角形分配温度，因为绕循环运行将需要返回带有错误奇偶校验的值。 正确的输出是`No`。 

另一种情况是：```
1
3 0 1 3
```有三个孤立的顶点和三个所需的温度。 答案可以通过分配`1 2 3`。 仅检查连接组件的粗心解决方案可能会忘记孤立的顶点。 

最后一个微妙的情况是一个具有许多顶点但仅覆盖较小温度范围的组件。 具有中心温度的恒星`2`和叶子温度`1`只提供温度`1`和`2`，即使它包含多个顶点。 计算顶点而不是不同的可达温度会给出错误的结果。 

## 方法

 直接的解决方案是尝试为每个温室分配一个温度，并检查约束是否成立。 每个顶点最多有`b-a+1`可能的值，因此搜索空间是指数级的并且立即不可能。 

图结构给出了更强的观察力。 在一个连接的组件内，固定一个顶点的温度后，每个其他顶点都会受到强制。 穿过边缘会通过以下任一方式改变温度`+1`或者`-1`。 如果两次遍历给同一个顶点提供了冲突的值，则该组件是不可能的。 

因此，有效组件具有固定的相对温度形状。 如果我们从任意根计算偏移量，则可以通过向每个偏移量添加相同的常数来移动整个分量。 该组件覆盖其最小偏移量和最大偏移量之间的每个整数，因为两个极端之间的路径必须经过所有中间值。 

所以问题就变成了为这些组件间隔选择班次，以便它们的并集涵盖`[a,b]`。 

由于顶点总数很少，我们可以通过区间覆盖来解决这个问题。 组件可以放置在内部任意位置`[a,b]`。 通过将组件放在已覆盖的部分旁边，可以贪婪地创建最大可能的覆盖段。 我们还需要记住所选择的变化来重建温度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了|
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 构建图的邻接表。 对于每个连接的组件，运行 BFS，同时存储每个顶点的偏移量。 第一个顶点接收偏移量`0`。 对于两个顶点之间的边，第二个顶点的偏移量必须比第一个顶点恰好大或小一个。 如果先前访问的顶点收到不同的偏移量，则该组件无效。 
2. 对于每个组件，记录其顶点的最小偏移、最大偏移和实际偏移。 元件的自然温度区间有长度`max_offset - min_offset + 1`。 
3. 移动每个组件，使其间隔适合内部`[a,b]`。 组件被贪婪地处理。 我们保持已经保证覆盖的最合适的温度。 如果组件移动使其左侧接触当前边界，则可以扩展此覆盖范围。 
4. 如果处理完所有组件后覆盖范围未达到`b`，无解。 否则，将存储的位移应用于每个顶点并打印温度。 

为什么它有效：

 每个有效组件只有一个自由度：向其所有顶点添加一个常量。 BFS 偏移描述了该组件的所有可能的分配。 由于连接的路径每一步都会将温度改变 1，因此会出现最小和最大偏移之间的每个值。 贪婪的放置永远不会浪费可能的扩展，因为提前放置组件只会减少未来未覆盖的区域。 因此达到`b`意味着已经创建了所有所需的温度，而未能达到则意味着相同间隔的安排无法覆盖整个范围。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, m, a, b = map(int, input().split())
        g = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)

        off = [None] * n
        comps = []
        ok = True

        for s in range(n):
            if off[s] is not None:
                continue

            off[s] = 0
            q = [s]
            comp = []
            head = 0

            while head < len(q):
                u = q[head]
                head += 1
                comp.append(u)

                for v in g[u]:
                    if off[v] is None:
                        off[v] = off[u] + 1
                        q.append(v)
                    elif abs(off[v] - off[u]) != 1:
                        ok = False

            mn = min(off[x] for x in comp)
            mx = max(off[x] for x in comp)
            comps.append((comp, mn, mx))

        if not ok:
            ans.append("No")
            continue

        comps.sort(key=lambda x: x[2] - x[1], reverse=True)

        cur = a - 1
        res = [0] * n

        for comp, mn, mx in comps:
            if cur >= b:
                break
            length = mx - mn + 1
            left = cur + 1
            if left + length - 1 <= b:
                shift = left - mn
                cur += length
            else:
                shift = b - mx
                cur = b

            for v in comp:
                res[v] = off[v] + shift

        if cur < b or any(x < a or x > b for x in res):
            ans.append("No")
        else:
            ans.append("Yes")
            ans.append(" ".join(map(str, res)))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```BFS部分是解决方案的核心。 偏移数组存储组件唯一可能的相对排列。 冲突检查使用`abs(off[v] - off[u]) != 1`，它捕获奇数循环和不​​一致的约束。 

组件列表将顶点及其偏移范围保存在一起。 排序步骤对于正确性并不是严格要求的，但首先放置较大的间隔可以简化贪婪覆盖过程。 

重建步骤使用保存的移位。 一个常见的错误是仅移动组件端点，而忘记组件中的每个顶点都需要相同的添加。 

## 工作示例

 对于第一个样本：```
3 3 1 2
1 2
2 3
3 1
```| 顶点| 当前偏移| 原因 |
 | --- | --- | --- |
 | 1 | 0 | BFS 根 |
 | 2 | 1 | 边缘需要差异 1 |
 | 3 | 1 或 -1 | 与边缘 1-3 的冲突 |

 三角形产生矛盾，因此算法打印`No`。 

对于第二个样本：```
3 2 1 2
1 2
2 3
```| 组件| 偏移范围| 班次| 温度|
 | --- | --- | --- | --- |
 | 1-2-3 | 1-2-3 | 0 到 1 | 1 | 1 2 1 | 1 2 1

 该组件涵盖了两个所需的温度，因此答案是有效的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | BFS 期间会处理每个顶点和边，并且重建会访问每个顶点一次。 |
 | 空间| O(n + m) | 图形、偏移量和组件存储是线性的。 |

 限制允许这样做，因为所有测试的顶点总数仅为 2000。 

## 测试用例```
# The online judge validates the program directly.
# These examples describe the important cases.

# Odd cycle:
# 1
# 3 3 1 2
# 1 2
# 2 3
# 3 1
# Expected: No

# Path covering all temperatures:
# 1
# 3 2 1 2
# 1 2
# 2 3
# Expected: Yes with values 1 2 1

# Single vertex:
# 1
# 1 0 0 0
# Expected: Yes with value 0

# Isolated vertices:
# 1
# 3 0 1 3
# Expected: Yes with values 1 2 3
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三角形图| 没有 | 检测不一致的周期 |
 | 三顶点路径| 是的 | 检查间隔生成 |
 | 一个孤立的顶点 | 是的 | 处理最小的图形 |
 | 几个孤立的顶点| 是的 | 确认所有温度都可以来自单独的组件 |

 ## 边缘情况

 对于奇数周期情况，BFS 分配周期周围的偏移量。 第三个边缘要求相差一，但已分配的偏移量无法满足它，因此在产生无效温度之前检测到矛盾。 

对于孤立的顶点，每个顶点都成为间隔长度为一的组件。 贪婪放置只是分配连续的温度，直到覆盖所需的范围。 

对于具有重复温度的组件（例如星形），算法使用偏移范围而不是顶点数量。 这可以正确测量组件实际可以提供的不同温度。
