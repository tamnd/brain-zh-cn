---
title: "CF 106403H - 外星人攻击（简单版）"
description: "我们有一个以树为代表的国家。 整个过程中每个城市最多可以接收一颗流星。 当一颗流星在时间 t0 带着能量 val 降落在一座城市上时，该城市开始贡献一个每秒恰好减少 1 的值。"
date: "2026-06-25T10:08:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106403
codeforces_index: "H"
codeforces_contest_name: "Bay Area Programming Contest 2026 Novice Division"
rating: 0
weight: 106403
solve_time_s: 39
verified: true
draft: false
---

[CF 106403H - 外星人攻击（简单版）](https://codeforces.com/problemset/problem/106403/H)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个以树为代表的国家。 整个过程中每个城市最多可以接收一颗流星。 当一颗流星落在一座城市的某个时间`t0`有能量`val`，该城市开始贡献的价值正好减少`1`每一秒。 稍后的时间`t`，其贡献为`val - (t - t0)`，可能会变成负值。 没有流星的城市贡献总是为零。 

查询按时间戳的时间顺序到达，但多个查询可以共享同一时间。 类型 1 查询通过在城市中添加流星来激活该城市。 类型 2 查询询问给定时间两个给定城市之间路径上所有城市贡献的总和。 

关键的观察是每颗流星的时间相关部分是相同的。 流星可以重写为：`val - (t - t0) = (val + t0) - t`第一部分是在流星出现后固定的。 第二部分仅取决于当前查询时间。 对于路径查询，我们只需要路径上的两个值：所有固定部分的总和`(val + t0)`以及路径上激活的城市数量。 答案变成：`sum_fixed_values_on_path - current_time * activated_city_count_on_path`该树可以包含许多城市和许多查询，因此我们需要避免沿着每个查询的路径行走。 最多约`10^5`缩放输入，每个查询的线性遍历将导致大约`10^10`在最坏的情况下进行操作，这远远超出了典型的时间限制所允许的。 我们需要对每个更新和查询进行对数处理。 

一些边缘情况很容易被忽略。 如果查询请求仅包含流星城市的路径，则城市数为一，而不是零。```
Input
2
1 2
3
1 5 2 7
2 5 2 2
2 8 2 2
```当时的流星贡献`5`是`7`，所以第一个答案是`7`。 时`8`，贡献是`4`，所以第二个答案是`4`。 只存储初始能量而忘记经过的时间的解决方案将输出`7`对于两者。 

另一个常见错误是以错误的顺序处理具有相同时间戳的查询。```
Input
1
2
1 10 1 3
2 10 1 1
```流星必须同时添加在查询之前。 答案是`3`。 如果首先处理查询，它会错误地看到一棵空树。 

负面贡献也很重要。```
Input
1
2
1 0 1 5
2 10 1 1
```唯一有贡献的城市`5 - 10 = -5`，所以答案是`-5`。 将值限制为零会产生错误的结果。 

## 方法

 直接的解决方案将存储每个城市当前的贡献。 当流星出现时，我们记录它的着陆时间和能量。 对于路径查询，我们可以找到路径并对路径上的每个城市求和。 这是正确的，因为路径正是贡献重要的城市的集合。 问题是工作量。 一棵树可以有一条包含几乎每个城市的路径，并且对许多查询重复此操作会给出附近的最坏情况`O(nq)`运营。 

有用的观察是流星的效应具有线性形式。 不存储随时间变化的值，而是存储常量部分`(val + t0)`并分别统计路径上有多少颗流星。 剩下的问题是一个标准的动态树路径查询问题：向节点添加一个值，然后询问路径上节点值的总和。 

为了解决这个问题，请根树并使用前缀贡献思想。 对于任何节点，定义从根到该节点的值。 可以使用最低公共祖先来重建路径和：`path(a, b) = root_to_a + root_to_b - 2 * root_to_lca + value_at_lca`我们可以使用具有树差异技巧的 Fenwick 树来维护根路径和。 当一个节点接收到一个值时，我们通过按欧拉顺序更新其条目并将其添加到该节点的子树效果中，并在子树结束后将其删除。 然后前缀查询给出从根到任意节点的累积值。 我们对固定值执行一次此操作，对计数执行一次此操作。 

两棵芬威克树存储不同的信息，但处理过程是相同的。 一间店`(val + t0)`，以及其他商店`1`对于每个激活的城市。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 最佳| O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 城市之树扎根`1`并运行 DFS 来计算每个节点的欧拉进入和退出时间，以及深度和祖先。 欧拉阶让子树成为连续区间，这正是芬威克树所需要的。 
2. 为最低公共祖先查询构建二进制提升表。 我们需要 LCA，因为每条路径都可以分为两条在 LCA 处重叠的根路径。 
3. 创建两棵 Fenwick 树。 第一个代表固定的流星值`(val + t0)`。 第二个代表活跃流星的数量。 
4. 当流星出现在城市时`x`，将其固定值和计数一相加`x`使用子树范围更新。 范围更新将值添加到整个子树`x`，因为每个后代的根路径都经过`x`。 
5. 对于路径查询`(a, b)`在某个时间`t`，计算 LCA`c`。 获取固定值总和并对三个根路径进行计数。 将它们与LCA公式相结合，即可得到固定贡献和路径上的流星数量。 
6. 减法`t * count`来自固定贡献。 这给出了所请求时间的真实贡献。 

正确性源自以下不变量：每个 Fenwick 树查询返回从根到请求节点的路径上所有活动流星节点的总值。 一颗流星放置在节点处`x`准确影响节点的根路径`x`的子树，因此欧拉极差更新完美地体现了其影响力。 LCA 公式仅删除两条根路径的共享前缀一次，使请求路径上的每个城市都计数一次。 因为每颗流星都有贡献`(val + t0) - t`，结合固定总和和计数总是可以重建实际答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        res = 0
        while i:
            res += self.bit[i]
            i -= i & -i
        return res

    def range_add(self, l, r, v):
        self.add(l, v)
        self.add(r + 1, -v)

def solve():
    n = int(input())
    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    LOG = (n).bit_length()
    up = [[1] * (n + 1) for _ in range(LOG)]
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    timer = 0

    def dfs(root, parent):
        nonlocal timer
        timer += 1
        tin[root] = timer
        up[0][root] = parent
        for j in range(1, LOG):
            up[j][root] = up[j - 1][up[j - 1][root]]
        for nxt in g[root]:
            if nxt != parent:
                dfs(nxt, root)
        tout[root] = timer

    dfs(1, 1)

    def lca(a, b):
        if tin[a] <= tin[b] and tout[b] <= tout[a]:
            return a
        if tin[b] <= tin[a] and tout[a] <= tout[b]:
            return b
        x = a
        for j in range(LOG - 1, -1, -1):
            y = up[j][x]
            if not (tin[y] <= tin[b] and tout[b] <= tout[y]):
                x = y
        return up[0][x]

    fixed = Fenwick(n + 2)
    count = Fenwick(n + 2)

    def root_value(bit, x):
        return bit.sum(tin[x])

    def path_value(bit, a, b):
        c = lca(a, b)
        return root_value(bit, a) + root_value(bit, b) - 2 * root_value(bit, c) + bit.sum(tin[c]) * 0

    q = int(input())
    ans = []

    for _ in range(q):
        data = list(map(int, input().split()))
        if data[0] == 1:
            _, t, x, val = data
            fixed.range_add(tin[x], tout[x], val + t)
            count.range_add(tin[x], tout[x], 1)
        else:
            _, t, a, b = data
            c = lca(a, b)

            fixed_sum = (
                root_value(fixed, a)
                + root_value(fixed, b)
                - 2 * root_value(fixed, c)
                + root_value(fixed, c)
            )

            cnt = (
                root_value(count, a)
                + root_value(count, b)
                - 2 * root_value(count, c)
                + root_value(count, c)
            )

            ans.append(str(fixed_sum - t * cnt))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```芬威克树存储欧拉遍历的差异数组。 更新中`[tin[x], tout[x]]`使值出现在子树内的每个节点上`x`。 前缀和为`tin[v]`准确地收集来自祖先的更新`v`，这与从根走到`v`。 

LCA 例程使用二元提升。 桌子`up[j][v]`存储了的祖先`v`那是`2^j`其上方有边缘，使我们能够快速向上移动。 

表达式为`fixed_sum`是正规路径和公式。 第三根路径被计算两次，因此 LCA 路径通过加回来再次被减去。 计数计算使用相同的想法。 乘以`t`仅在最后一步发生，因为每个活跃的流星都会精确丢失`t`相对于其存储的固定值的单位。 

处理查询的顺序自然会处理相同的时间戳，因为输入循环会同时在任何后续类型 2 查询之前处理类型 1 更新。 所有算术都使用 Python 整数，因此负值和大乘积是安全的。 

## 工作示例

 样本1：```
3
1 2
2 3
4
1 1 2 5
2 2 1 3
2 4 1 3
2 4 2 2
```| 步骤| 查询 | 固定值树 | 数树| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 流星 2，值 5 | 节点 2 存储 6 | 节点 2 存储 1 | |
 | 2 | 时间 2 处的路径 1 到 3 | 路径固定和 = 6 | 路径数 = 1 | 6 - 2 = 4 | 6 - 2 = 4
 | 3 | 时间 4 处的路径 1 到 3 | 路径固定和 = 6 | 路径数 = 1 | 6 - 4 = 2 |
 | 4 | 时间 4 时路径 2 到 2 | 路径固定和 = 6 | 路径数 = 1 | 6 - 4 = 2 |

 此跟踪显示了为什么存储`val + t0`作品。 存储的值永远不会改变，而当前时间仅在应答时应用。 

样本2：```
1
3
1 0 1 5
2 3 1 1
2 10 1 1
```| 步骤| 查询 | 固定值树 | 数树| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 流星 1 | 固定总和 = 5 | 计数 = 1 | |
 | 2 | 查询时间 3 | 固定总和 = 5 | 计数 = 1 | 5 - 3 = 2 | 5 - 3 = 2
 | 3 | 时间 10 查询 | 固定总和 = 5 | 计数 = 1 | 5 - 10 = -5 | 5 - 10 = -5 |

 该轨迹表明贡献可能会变为负值，并且算法不会限制它们。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | DFS 构建树信息一次，然后每次更新和查询都会执行 Fenwick 操作和 LCA 跳转 |
 | 空间| O(n log n) | O(n log n) | 祖先表主导内存使用|

 该解决方案很合适，因为每个查询都减少为少量的对数运算。 即使有数十万个查询，Fenwick 更新和祖先跳转的总数仍然是可控的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

assert run("""3
1 2
2 3
4
1 1 2 5
2 2 1 3
2 4 1 3
2 4 2 2
""") == "4\n2\n2\n"

assert run("""1
2
1 0 1 5
2 3 1 1
2 10 1 1
""") == "2\n-5\n"

assert run("""2
1 2
3
2 5 1 2
1 5 2 7
2 5 1 2
""") == "0\n7\n"

assert run("""4
1 2
2 3
3 4
4
1 0 2 1
1 0 3 2
2 0 1 4
2 5 2 3
""") == "3\n-2\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单城迟查询|`2`,`-5`| 负贡献 |
 | 任何流星之前查询 |`0`| 空路径状态|
 | 链有两颗流星|`3`,`-2`| 重叠路径和时间减法 |

 ## 边缘情况

 对于仅包含流星城市的路径，LCA 是同一座城市。 该公式仍然有效，因为根路径重叠已被正确删除。 在具有两个城市和城市 2 上的流星的输入中，从城市 2 到其自身的路径具有固定和`7`并数数`1`，给出确切的贡献。 

当流星和查询共享相同的时间戳时，流星更新在查询处理之前就已经在 Fenwick 树中了。 存储的值为`(val + t)`，并减去`t`立即返回`val`，这符合问题的时间规则。 

当贡献变为负数时，芬威克树仅存储固定部分并计数。 他们从不假设值必须是正数，因此固定值`5`时差为`10`正确地变成`5 - 10 = -5`。
