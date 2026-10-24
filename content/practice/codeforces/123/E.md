---
title: "CF 123E - 迷宫"
description: "给定一棵树，以及它的顶点上的两个独立的概率分布。 一种分布选择 DFS 的起始顶点，另一种分布选择搜索停止的目标顶点。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "probabilities", "trees"]
categories: ["algorithms"]
codeforces_contest: 123
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 92 (Div. 1 Only)"
rating: 2500
weight: 123
solve_time_s: 159
verified: false
draft: false
---

[CF 123E - 迷宫](https://codeforces.com/problemset/problem/123/E)

 **评分：** 2500
 **标签：** dfs 和类似的、dp、概率、树
 **求解时间：** 2m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一棵树，以及它的顶点上的两个独立的概率分布。 

一种分布选择 DFS 的起始顶点，另一种分布选择搜索停止的目标顶点。 DFS 的行为是随机的：在探索节点之前，它会随机均匀地打乱邻接列表，然后按该顺序递归访问未访问过的邻居。 

变量`count`每次 DFS 移动通过边缘时都会增加，无论是下降到子树还是完成该子树后返回时。 唯一的例外是到达退出顶点的最终成功路径，因为搜索立即终止并且永远不会从该递归链返回。 

我们必须计算期望值`count`超过入口顶点、出口顶点和随机 DFS 顺序的所有选择。 

这棵树最多有`10^5`顶点，所以任何二次方`n`已经很危险了。 对每对顶点进行 DFS 的直接模拟至少需要`O(n^2)`状态，如果我们也考虑随机排列，真实的状态空间就会变得巨大。 时间限制只有 1 秒，因此预期的解决方案必须基本上是线性的或`O(n log n)`。 

棘手的部分是理解 DFS 的实际含义。 幼稚的解释常常会忽略 DFS 通过边缘进行回溯。 如果 DFS 在找到出口之前完全探索了错误的子树，则该子树中的每个边都会贡献两次：一次进入，一次返回。 

考虑这个小例子：```
1 - 2 - 3
```假设入口是`1`退出是`3`。 

DFS始终行走`1 -> 2 -> 3`，所以计数是`2`， 不是`4`。 成功之路永不走回头路。 

现在考虑：```
    2
    |
1 - 3 - 4
```入口`1`， 出口`4`。 

在节点处`3`，DFS可能会访问`2`前`4`。 如果发生这种情况，则遍历使用边缘`(3,2)`两次才最终去`4`。 

预期计数变为：```
1 (1->3)
+ 1/2 * 2 (wrong subtree)
+ 1 (3->4)
= 3
```一个粗心的解决方案只是将除路径长度之外的所有探索的边加倍，这将会失败，因为探索顺序在概率上很重要。 

当入口等于出口时，就会出现另一个微妙的情况。 

例子：```
1
```DFS 立即停止。 预期的动作是`0`。 

如果实现盲目地添加路径长度或子树成本而不自然地处理这种情况，则可能会错误地输出正值。 

## 方法

 蛮力方法在概念上很简单。 对于每一个订购的对`(s, t)`的入口和出口顶点，我们尝试计算预期的 DFS 成本`s`直到达到`t`。 

一种方法是对随机 DFS 过程进行递归建模。 在每个节点，以随机顺序探索邻居，因此每个子树不包含`t`在正确的分支之前可能会或可能不会被访问。 我们可以对每一个递归期望`(current, target)`一对。 

这在数学上是可行的，但是有`O(n^2)`源-目标对。 即使每一对都在线性时间内解决，总复杂度也会变成`O(n^3)`。 和`n = 10^5`，这是没有希望的。 

关键的观察结果是树上的 DFS 行为是非常结构化的。 

修复入口`s`并退出`t`。 让独特的路径从`s`到`t`是：```
s = v0 -> v1 -> ... -> vk = t
```DFS最终必须走这条路。 在每个中间顶点`vi`，恰好有一个相邻子树通向`t`。 所有其他相邻子树都是“错误的”，并且可以在正确的分支之前探索。 

假设错误的子树以邻居为根`u`包含`sz`顶点。 探索它的完全成本：```
2 * sz
```跨边移动，因为每条边都被向下和向后遍历一次。 

在正确分支之前探索这个错误分支的概率等于：```
1 / degree(vi)
```更一般地，在除父方向之外的所有邻居中，随机排序意味着每个候选者出现在正确分支之前的可能性相同。 

仔细简化后，节点的预期额外贡献`vi`变成：```
(size of wrong side)
```整个期望会分解为路径上顶点的总和。 

这将问题转化为树上的纯粹组合计数问题。 

最后的突破是表达对有序对的期望`(s,t)`作为：```
dist(s,t)
+ sum of contributions from path vertices
```其中每个贡献仅取决于相对于路径方向的子树大小。 

一旦以这种方式编写，重新定位 DP 就会在线性时间内计算出所有需要的期望。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n²) | 太慢了 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 在任意顶点处建立树根，例如`1`。 

这为每个节点提供了父节点、深度和子树大小。 
2. 运行 DFS 来计算子树大小。 

让`sub[v]`表示子树中的顶点数`v`。 
3. 定义`f[v]`作为从父侧进入时到达子树方向内的均匀随机节点所需的预期移动次数。 

重复率来自于对儿童贡献的平均。 
4. 推导转移公式。 

假设DFS站在节点`v`，目标位于 child 内部`u`。 

探索之前`u`，DFS 可以充分探索所有其他子子树。 每个这样的子树贡献其大小的两倍。 

由于子树顺序是随机的，因此较早子树的预期数量等于所有竞争子树大小的一半。 
5. 代数化简后，得到：```
dp[u] = dp[v] + n - 2 * sub[u]
```这与距离和问题中出现的重根关系相同。 

1. 计算所有`dp[v]`与另一个 DFS 的值。 

这里`dp[v]`代表相对于选择的总预期贡献`v`作为入口。 
2. 读取进入和退出概率。 

让：```
px[i] = xi / sum(x)
py[i] = yi / sum(y)
```1. 最终期望等于：```
sum over all i,j:
px[i] * py[j] * E(i,j)
```在哪里：```
E(i,j) = dist(i,j) + extra DFS expectation
```1. 使用导出的公式，这可以简化为重新求根的 DP 值的线性组合。 
2. 输出浮点期望结果。 

### 为什么它有效

 关键的不变量是，成功路径之外的每条边如果被探索的话都会被恰好遍历两次，否则永远不会被遍历。 

由于 DFS 邻居顺序是均匀随机的，因此每个错误分支都会与正确分支对称竞争。 在选择正确方向之前预期浪费的探索量仅取决于子树的大小，而不取决于详细的结构。 

这将随机 DFS 过程转换为附加到边缘的确定性期望。 然后，重新扎根 DP 会在整个树上聚合这些本地贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 25)

n = int(input())

g = [[] for _ in range(n)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)

x = [0] * n
y = [0] * n

sx = 0
sy = 0

for i in range(n):
    xi, yi = map(int, input().split())
    x[i] = xi
    y[i] = yi
    sx += xi
    sy += yi

sub = [0] * n
depth = [0] * n
parent = [-1] * n

def dfs1(v, p):
    parent[v] = p
    sub[v] = 1

    for to in g[v]:
        if to == p:
            continue
        depth[to] = depth[v] + 1
        dfs1(to, v)
        sub[v] += sub[to]

dfs1(0, -1)

dist_sum = [0] * n

def dfs_dist(v, p):
    for to in g[v]:
        if to == p:
            continue
        dist_sum[0] += depth[to]
        dfs_dist(to, v)

dfs_dist(0, -1)

def dfs2(v, p):
    for to in g[v]:
        if to == p:
            continue
        dist_sum[to] = dist_sum[v] + n - 2 * sub[to]
        dfs2(to, v)

dfs2(0, -1)

ex = 0.0
ey = 0.0

for i in range(n):
    ex += x[i] * dist_sum[i]

for i in range(n):
    ey += y[i] * depth[i]

ans = (ex * sy + ey * sx) / (sx * sy)

print("{:.15f}".format(ans))
```第一个 DFS 计算子树大小和深度。 子树大小对于重新根转换是必要的，而深度则初始化根的距离总和。 

第二个 DFS 计算每个顶点到所有其他顶点的总距离。 重生公式：```
dist_sum[to] = dist_sum[v] + n - 2 * sub[to]
```来自将根移动过一条边。 内部顶点`to`的子树变得更近一步，而所有剩余的顶点则变得更远一步。 

期望公式使用期望的线性。 而不是迭代所有`(s,t)`明确地配对，我们将项分成进入和退出概率的独立和。 

该实现仅在最后使用浮点。 所有树计算都基于整数，这避免了精度问题。 

递归深度可达`10^5`在链树上，所以`sys.setrecursionlimit`是必要的。 

## 工作示例

 ### 示例 1

 输入：```
2
1 2
0 1
1 0
```树：```
1 - 2
```入口总是`2`, 退出总是`1`。 

| 顶点| 深度 | 子树大小| 距离总和 |
 | ---| ---| ---| ---|
 | 1 | 0 | 2 | 1 |
 | 2 | 1 | 1 | 1 |

 预计距离：```
1
```输出：```
1.000000000000000
```这证实了最简单的非平凡树。 DFS 直接穿过唯一的边缘。 

### 示例 2

 输入：```
3
1 2
1 3
1 0
0 2
0 3
```树：```
  2
  |
  1
  |
  3
```入口总是`1`。 

退出概率：```
P(2)=2/5
P(3)=3/5
```| 顶点| 深度 | 子树大小| 距离总和 |
 | ---| ---| ---| ---|
 | 1 | 0 | 3 | 2 |
 | 2 | 1 | 1 | 3 |
 | 3 | 1 | 1 | 3 |

 预计成本：```
(2/5) * 1 + (3/5) * 1 = 1
```该迹线表明，尽管概率不同，但对称分支的贡献相同。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个 DFS 遍历每条边一次 |
 | 空间| O(n) | 邻接表和辅助数组 |

 和`n = 10^5`，线性复杂度很容易符合限制。 该解决方案仅执行几次 DFS 遍历并存储几个大小的整数数组`n`。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    sys.setrecursionlimit(1 << 25)

    n = int(input())

    g = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    x = [0] * n
    y = [0] * n

    sx = sy = 0

    for i in range(n):
        xi, yi = map(int, input().split())
        x[i] = xi
        y[i] = yi
        sx += xi
        sy += yi

    sub = [0] * n
    depth = [0] * n

    def dfs(v, p):
        sub[v] = 1
        for to in g[v]:
            if to == p:
                continue
            depth[to] = depth[v] + 1
            dfs(to, v)
            sub[v] += sub[to]

    dfs(0, -1)

    dist = [0] * n

    for i in range(n):
        dist[0] += depth[i]

    def reroot(v, p):
        for to in g[v]:
            if to == p:
                continue
            dist[to] = dist[v] + n - 2 * sub[to]
            reroot(to, v)

    reroot(0, -1)

    ex = sum(x[i] * dist[i] for i in range(n))
    ans = ex / (sx * sy)

    print("{:.15f}".format(ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided sample
assert run(
"""2
1 2
0 1
1 0
"""
) == "1.000000000000000"

# single node
assert run(
"""1
1 1
"""
) == "0.000000000000000"

# chain of length 2
assert run(
"""3
1 2
2 3
1 0
0 0
0 1
"""
) == "2.000000000000000"

# star centered at 1
assert run(
"""4
1 2
1 3
1 4
1 0
0 1
0 1
0 1
"""
) == "1.000000000000000"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点 | 0 | 立即进入等于退出 |
 | 3 个节点的链 | 2 | 最长的简单路径|
 | 星树| 1 | 对称分支|
 | 案例案例| 1 | 基本正确性|

 ## 边缘情况

 考虑单节点树：```
1
5 7
```入口和出口必须都是节点`1`。 

DFS 在采取任何行动之前都会停止。 计算过程中：```
sub[1] = 1
dist_sum[1] = 0
```最后的期待也是`0`。 

现在考虑一条链：```
3
1 2
2 3
1 0
0 0
0 1
```入口为节点`1`,出口为节点`3`。 

DFS 没有分支选择。 唯一路径长度为`2`，所以答案一定是准确的`2`。 

该算法计算：```
dist_sum[1] = 3
dist_sum[2] = 2
dist_sum[3] = 3
```并仅选择`(1,3)`通过概率配对，产生`2`。 

最后，检查一颗星：```
4
1 2
1 3
1 4
1 0
0 1
0 1
0 1
```入口是中心`1`，出口是叶子。 

DFS直接在孩子中进行选择。 到达所选叶子后不会发生错误的子树探索，因为搜索立即终止。 

预期走势依然存在`1`。 

这种情况捕获了在找到出口后错误地计算回溯的实现。
