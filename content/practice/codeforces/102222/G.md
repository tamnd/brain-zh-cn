---
title: "CF 102222G - 工厂"
description: "我们有一个加权的城市树。 工厂只能放置在原始叶子上，这意味着城市在无向树中的度恰好为一。"
date: "2026-08-17T22:10:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "G"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 188
verified: true
draft: false
---

[CF 102222G - 工厂](https://codeforces.com/problemset/problem/102222/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个加权的城市树。 工厂只能放置在原始叶子上，这意味着城市在无向树中的度恰好为一。 我们必须准确选择`k`不同的叶子，并最小化所有无序的所选叶子对的最短路径距离的总和。 

输入最多包含`10^3`测试用例，与`n`最多`10^5`对于一个测试用例和所有测试用例的总和`n`受`10^6`。 工厂数量`k`至多是`100`，这是使动态规划解决方案成为可能的参数。 官方限制为 10 秒和 256 MB。 

的大值`n`排除城市数量呈二次方的情况。 甚至`O(nk^2)`大致达到`10^9`基本转换，当两者`n=10^5`和`k=100`，因此实现需要保持实际状态范围较窄，而不是盲目地迭代所有状态`k`每个节点的状态。 对可能的工厂集进行指数搜索是完全不可能的，因为叶子的数量本身可以接近`10^5`。 

第一个边缘情况是`k=1`。 没有成对的工厂，所以无论树是什么，答案都是零。```
1
2 1
1 2 7
```正确的输出是`Case #1: 0`。 意外增加从工厂到自身的距离的解决方案将产生一个非零值。 

第二个边缘情况是具有两个城市的最小可能的树。 两个城市都是叶子，尽管可能会选择其中之一作为我们实施的根。```
1
2 2
1 2 7
```正确的输出是`Case #1: 7`。 粗心的有根树实现可能仅将子级分类为可选择的叶子并丢失一个有效的工厂位置。 

第三种边缘情况是只有原始叶子才符合条件。 考虑一条路径。```
1
4 2
1 2 1
2 3 1
3 4 1
```唯一可能的工厂是城市`1`和`4`，所以答案是`3`。 将每个顶点视为可能工厂的解决方案可能会错误地选择相邻城市并获得`1`。 

当必须选择所有叶子时，会出现第四种边缘情况。```
1
4 3
1 2 2
1 3 3
1 4 4
```三叶是被迫的。 他们的两两距离是`5`,`6`， 和`7`, 给予`18`。 如果 DP 仅使用其下方所选叶子的数量来计算边缘的贡献，但忘记了其外部所选叶子的数量，则在这种情况下会出错。 

## 方法

 直接的方法是枚举每组`k`离开，计算该集合内的距离总和，并保留最小值。 如果有`L`离开，这检查`C(L,k)`可能的工厂设置。 即使所有成对叶子距离提前可用，每个候选集也需要`C(k,2)`结对评价。 在最坏的允许形状下，一颗恒星已经`L=99999`叶，所以对于`k=100`仅配对评估的数量就是`C(99999,100) * C(100,2)`,

 这远远超出了任何实际计算。 预先计算每个叶子到叶子的距离也需要二次内存。 

有用的观察是，树可以让我们独立地计算每条边的贡献。 修复一组`k`工厂离开并去除重量的边缘`w`。 假设准确地说`x`选定的叶子位于边缘的一侧。 那么正是`k-x`选定的叶子位于另一侧。 每对由每一侧的一个叶子组成，都有一条包含该边的路径，因此该边被精确地使用`x(k-x)`工厂对。 因此它对总答案的贡献是`w * x * (k-x)`。 

这会将叶子对上的总和转换为边缘上的总和。 相同的边缘贡献公式是该问题的标准解决方案所使用的中心观察。 

现在给树扎根。 对于每个节点`u`，仅考虑其根子树中的叶子。 定义`dp[u][j]`作为完全在该子树内的所有边的最小贡献，当恰好`j`工厂就选在那里。 父级不需要知道选择了哪些叶子，只需要知道选择了多少个，因为将子树连接到树的其余部分的唯一边是父级边。 

认为`v`是一个孩子`u`，和边缘`u-v`有重量`w`。 如果我们采取`x`工厂来自`v`的子树，该边贡献`w*x*(k-x)`。 如果已经处理的部分`u`包含`j-x`工厂，转变变成`dp[u][j] = min(dp[u][j], dp[u][j-x] + dp[v][x] + w*x*(k-x))`。 

这是一个树背包。 该转换正是该问题的现有解决方案中描述的标准子子树合并。 

暴力方法之所以有效，是因为每个可能的工厂集都被明确考虑，但它会失败，因为这样的集数量呈指数级增长。 边缘贡献观察让我们在处理子树时忘记所选叶子的身份并只保留它们的计数。 自从`k`至多是`100`，这将问题转化为有界动态规划。 

树背包递归的标准最坏情况界限是`O(nk^2)`。 下面的实现通过仅存储可达状态并将每个转换限制在有效范围内，显着改进了实际行为。 特别是，分支子树上方的长链不会重复扫描不可能的状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(C(L,k) * k^2)`距离预处理后 |`O(L^2)`如果所有叶子距离都已存储 | 太慢了 |
 | 最佳DP |`O(nk^2)`最坏的情况，具有严格的可达状态剪枝|`O(nk)`最坏的情况| 已接受 |

 ## 算法演练

 1. 城市之树扎根`1`并建立父子之前的遍历顺序。 使用迭代遍历是因为树可以是长度的路径`10^5`，这将使递归 Python DFS 容易受到递归深度限制。 
2.记录每个城市的原始度数。 一个城市在其原始度为 时准确地贡献一个可选择的工厂状态`1`。 根由相同的规则处理，这对于两个顶点都是叶子的双城市树是必需的。 
3. 以反向遍历顺序处理顶点，因此每个子节点在处理其父节点之前就已经计算了其 DP。 对于非叶子节点，将其 DP 初始化为`[0]`，表示从子树中选择零叶子的选择。 对于叶子，初始化`[0, 0]`，其中状态`1`意味着选择该叶子并且子树内的成本为零。 
4. 对于每个孩子`v`的`u`, 合并`dp[v]`进入`dp[u]`。 假设当前`u`国家最多支持`a`选定的叶子和孩子最多支持`b`。 获得包含的状态`j`工厂，尝试每个有效的数字`x`从孩子身上夺走。 候选人是`dp[u][j-x] + dp[v][x] + w*x*(k-x)`。 
5. 执行`j`向后循环。 当前的DP数组就地更新，所以降序`j`保证`dp[u][j-x]`仍然指的是该子级合并之前的状态。 这与一维 0/1 背包向后处理容量的原因相同。 
6. 不要迭代不可能的值。 如果当前部分最多包含`a`可选择的叶子，然后是一个状态`j-x`大于`a`不可能存在。 同样地，`x`不能超过子级所代表的状态数。 这种修剪对于长链特别有用，在长链中，简单的实现可以将大部分时间花在测试无穷值状态上。 
7. 合并根的所有子节点后，`dp[root][k]`是每条边的最小可能贡献`k`选定的叶子。 打印该值作为测试用例的答案。 

### 为什么它有效

 对于任何固定的工厂选择，每条边根据其两侧有多少个选定的叶子进行独立贡献。 DP状态准确记录了父节点所需的信息，即子树中选定的叶子的数量以及该子树下方所有边的最小贡献。 当一个孩子被合并时，每个可能的数字`x`考虑来自该子节点的选定叶子的数量，并且连接边缘恰好收到贡献`w*x*(k-x)`被这个选择所迫。 因此，每个有效的工厂集对应于一系列 DP 转换，并且每个 DP 转换代表来自不相交子子树的工厂选择的有效组合。 取所有转换中的最小值给出最优值。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

INF = 10**18

def solve():
    input = sys.stdin.readline
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        n, k = map(int, input().split())

        # Compact forward-star adjacency representation.
        head = array('i', [-1]) * n
        to = array('i')
        weight = array('i')
        nxt = array('i')

        degree = array('i', [0]) * n

        for _ in range(n - 1):
            u, v, w = map(int, input().split())
            u -= 1
            v -= 1

            idx = len(to)
            to.append(v)
            weight.append(w)
            nxt.append(head[u])
            head[u] = idx

            idx = len(to)
            to.append(u)
            weight.append(w)
            nxt.append(head[v])
            head[v] = idx

            degree[u] += 1
            degree[v] += 1

        # Root the tree at 0 and construct a preorder.
        parent = array('i', [-2]) * n
        parent[0] = -1
        parent_weight = array('i', [0]) * n
        order = [0]

        for u in order:
            e = head[u]
            while e != -1:
                v = to[e]
                if v != parent[u] and parent[v] == -2:
                    parent[v] = u
                    parent_weight[v] = weight[e]
                    order.append(v)
                e = nxt[e]

        # dp[u] is an array indexed by the number of selected leaves.
        # Only reachable states are stored.
        dp = [None] * n

        for u in reversed(order):
            if degree[u] == 1:
                cur = 1
                du = array('q', [0, 0])
            else:
                cur = 0
                du = array('q', [0])

            e = head[u]

            while e != -1:
                v = to[e]

                if parent[v] == u:
                    dv = dp[v]
                    child_lim = len(dv) - 1

                    new_lim = cur + child_lim
                    if new_lim > k:
                        new_lim = k

                    if new_lim > cur:
                        du.extend([INF] * (new_lim - cur))

                    w = parent_weight[v]

                    # Descending j keeps du[j-x] unchanged during
                    # this child merge.
                    for j in range(new_lim, 0, -1):
                        if j <= cur:
                            best = du[j]
                        else:
                            best = INF

                        lo = j - cur
                        if lo < 1:
                            lo = 1

                        hi = child_lim
                        if hi > j:
                            hi = j

                        for x in range(lo, hi + 1):
                            cand = du[j - x] + dv[x] + w * x * (k - x)
                            if cand < best:
                                best = cand

                        du[j] = best

                    cur = new_lim

                    # The child DP is no longer needed after this merge.
                    dp[v] = None

                e = nxt[e]

            dp[u] = du

        out.append(f"Case #{case_id}: {dp[0][k]}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```邻接结构使用四个紧凑整数数组，而不是 Python 元组和嵌套列表。 高达`10^5`每个测试用例的城市数和 256 MB 内存限制，这很重要，因为否则 Python 对象开销可能会变得很大。 

父构造是迭代的。`order`包含按遍历顺序排列的顶点，将其反转即可准确给出 DP 所需的后序。`parent_weight[v]`存储边连接的权重`v`到其父级，因此 DP 阶段不需要再次搜索该权重。 

内部节点的 DP 数组仅从状态 0 开始。 叶子从状态 0 和 1 开始。 这种区别使用原始度，而不是有根的子节点数，因为工厂资格是由原始无向树定义的。 

最微妙的部分是就地合并。 假设旧的 DP 包含以下状态`cur`。 扩展数组后，如上所述`cur`被初始化为无穷大。 对于目标状态`j`，下界`j-cur`在`x`保证`j-x`是一个旧的可达状态。 迭代`j`从大到小可以防止已更新的状态在同一子合并中重复使用。 

期限`w * x * (k - x)`使用全球请求的工厂数量`k`，而不是当前在处理的子树中选择的数字。 失踪者`k-x`工厂必然位于子子树之外，因此这些对恰好穿过父边缘。 

所有算术均通过 DP 阵列中的 64 位存储执行。 最大可能的答案就在下面`10^18`，因为最多有`C(100,2)`工厂对，每棵树的距离最多为`(n-1)*10^5`。 

## 工作示例

 ### 示例 1

 这棵树是一颗以城市为中心的星星`1`，带有权重的叶边`2`,`3`， 和`4`。 我们需要两个工厂。 

为了`k=2`，选择权重边缘下方的一片叶子`w`贡献`w*1*(2-1)=w`。 

| 处理过的孩子 | 边重|`dp[0]`|`dp[1]`|`dp[2]`|
 | ---| ---| ---| ---| ---|
 | 无 | |`0`|`INF`|`INF`|
 | 城市2 |`2`|`0`|`2`|`INF`|
 | 城市3 |`3`|`0`|`2`|`5`|
 | 城市 4 |`4`|`0`|`2`|`5`|

 经过城市`2`, 一个工厂成本`2`。 经过城市`3`, 两个工厂可以放置在城市`2`和`3`, 成本核算`2+3=5`。 添加城市`4`无法提高该价值，因为两个最便宜的叶子仍然是城市`2`和`3`。 答案是`5`。 

### 示例 2

 使用相同的星星，但现在`k=3`。 每个选定的叶子都会为该边缘之外的两个工厂中的每一个贡献一次边缘，因此权重边缘上的叶子`w`贡献`2w`。 

| 处理过的孩子 | 边重|`dp[0]`|`dp[1]`|`dp[2]`|`dp[3]`|
 | ---| ---| ---| ---| ---| ---|
 | 无 | |`0`|`INF`|`INF`|`INF`|
 | 城市2 |`2`|`0`|`4`|`INF`|`INF`|
 | 城市3 |`3`|`0`|`4`|`10`|`INF`|
 | 城市 4 |`4`|`0`|`4`|`10`|`18`|

 最终状态选择所有三个叶子。 其边缘贡献为`4`,`6`， 和`8`, 给予`18`。 这证实了该因素`k-x`必须使用所请求的工厂总数，而不仅仅是已处理部分中已存在的数量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(nk^2)`最坏的情况| 每个子合并最多是一个有界背包卷积`k`states |
 | 空间|`O(nk)`最坏的情况| DP 状态按节点存储，具有紧凑的 64 位值 |

 刻意保留约束`k`仅在`100`，而城市总数最多为`10^6`。 该实现进一步将每次合并限制为实际可以达到的状态，并在合并后立即丢弃子 DP。 它还避免了递归 DFS 并使用紧凑数组来存储大型图形和 DP。 标准递归及其边缘贡献公式与问题的既定解决方案相匹配。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
# helper: run solution on input string, return output string
import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
sample = """\
2
4 2
1 2 2
1 3 3
1 4 4
4 3
1 2 2
1 3 3
1 4 4
"""
assert run(sample) == "Case #1: 5\nCase #2: 18", "provided samples"

# Minimum-size tree, k = 1.
assert run("""\
1
2 1
1 2 7
""") == "Case #1: 0", "one factory has no pairwise distance"

# Minimum-size tree, both cities are leaves.
assert run("""\
1
2 2
1 2 7
""") == "Case #1: 7", "both vertices must be recognized as leaves"

# All leaf edges have equal weight.
assert run("""\
1
5 3
1 2 1
1 3 1
1 4 1
1 5 1
""") == "Case #1: 6", "three selected leaves have three pairs of distance 2"

# Only two leaves exist, so both endpoints of the path are forced.
assert run("""\
1
5 2
1 2 1
2 3 2
3 4 3
4 5 4
""") == "Case #1: 10", "internal vertices are not eligible factories"

# Maximum-size star, with k = 100 and all edge weights equal to 1.
# Every pair of selected leaves has distance 2.
n = 100000
edges = "\n".join(f"1 {v} 1" for v in range(2, n + 1))
max_case = f"1\n{n} 100\n{edges}\n"
assert run(max_case) == "Case #1: 9900", "maximum-size stress case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1`, 重量的一条边`7`|`0`| 边界情况`k=1`|
 |`2 2`, 重量的一条边`7`|`7`| 两个顶点都是叶子 |
 | 五节点单位权星，`k=3`|`6`| 等值和精确的配对计数 |
 | 五节点加权路径，`k=2`|`10`| 只能选择原始叶子 |
 |`100000`-节点单位权重星，`k=100`|`9900`| 最大限度`n`， 最大限度`k`和性能|

 ## 边缘情况

 对于`k=1`，考虑输入```
1
2 1
1 2 7
```叶子 DP 包含状态`0`和`1`。 通过唯一的边选择一个工厂的转换增加了`7*1*(1-1)=0`。 因此根达到`dp[1]=0`，这是正确答案。 

对于两个城市的情况`k=2`,```
1
2 2
1 2 7
```两个顶点的度数均为一。 扎根于城市`1`创造城市`1`可选择的根叶和城市`2`可选择的子叶。 合并孩子后，两工厂状态收到`7*1*(2-1)=7`。 结果是`7`，因此有根表示不会丢失根叶。 

对于一条路径，```
1
4 2
1 2 1
2 3 1
3 4 1
```城市`1`和`4`是唯一的叶子。 DP无法选择城市`2`或者`3`因为他们原来的学位是二。 必须选择两个端点叶子，它们的距离为`1+1+1=3`。 边缘贡献也`1`,`1`， 和`1`，给出相同的总数。 

对于必须选择每片叶子的情况，```
1
4 3
1 2 2
1 3 3
1 4 4
```根是内部的，每个孩子都是叶子。 和`k=3`，每个叶边缘下方的选定计数为`1`，所以三个边的贡献是`2*1*2=4`,`3*1*2=6`， 和`4*1*2=8`。 他们的总和是`18`，匹配直接成对距离`5+6+7`。 这是整个 DP 背后的关键不变量：每个工厂对在其路径上的每个边缘上都充电一次。
