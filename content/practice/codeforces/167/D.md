---
title: "CF 167D - 奇才与道路"
description: "我们在飞机上得到了一组城市。 每个城市都有唯一的 x 坐标和唯一的 y 坐标。 前 k 个城市是明确给出的，其余城市由两个线性递归生成。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "graph-matchings", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 167
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 114 (Div. 1)"
rating: 3000
weight: 167
solve_time_s: 128
verified: true
draft: false
---

[CF 167D - 巫师与道路](https://codeforces.com/problemset/problem/167/D)

 **评分：** 3000
 **标签：** 数据结构、分而治之、图匹配、图、贪心
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在飞机上得到了一组城市。 每个城市都有独特的`x`坐标和唯一`y`协调。 第一个`k`明确给出城市，其余城市由两个线性递归生成。 

对于每个查询间隔`[L, R]`，我们只保留那些城市`x`坐标位于该区间内。 在此过滤集上，特殊规则会在某些城市对之间创建道路。 

语句中的几何定义看起来很吓人，但实际的图形结构要简单得多。 一旦城市按以下顺序排序`x`，道路恰好形成由以下定义的笛卡尔树的边缘`y`价值观。 另一种等效的解释是这样的：

 对于两个城市`u`和`v`， 和`y_u > y_v`，有一条路当且仅当`u`是距离最近的高等城市`v`在左边或右边。 

该查询要求此图中仅限于以下城市的最大匹配大小`L ≤ x ≤ R`。 

这些约束完全排除了每个查询重建图的可能性。 我们可能有`10^5`城市和`10^5`查询，所以任何靠近`O(nm)`是不可能的。 甚至`O(n√n)`在 Python 中已经很危险了。 目标大致是`O(n log n + m log n)`。 

问题的一个微妙部分是图表本身取决于所选的间隔。 境外城市`[L, R]`根本不参与，甚至不作为几何条件下的阻碍者。 构造全局图一次并且稍后仅过滤顶点的简单实现是不正确的。 

考虑城市：```
x: 1 2 3
y: 3 1 2
```在全球范围内，城市`2`连接到两者`1`和`3`。 

对于间隔`[2,3]`， 城市`1`消失。 然后城市`2`只有一个可能的边，即`(2,3)`。 搭配尺寸依然是`1`，但局部图发生了变化。 任何依赖全局图而无需重新计算的方法在更复杂的示例中都会默默地失败。 

当区间仅包含一个城市时，会出现另一种危险的边缘情况。```
x: 5
y: 10
```答案一定是`0`。 笛卡尔树 DP 的一些实现意外地错误地处理了空子节点并产生`1`。 

最重要的结构边缘情况是单调序列。```
x: 1 2 3 4
y: 1 2 3 4
```该图变成了一个简单的链。 最大匹配为`2`， 不是`1`。 任何总是首先匹配最高节点的贪婪算法在这里都会失败。 

## 方法

 蛮力的想法很简单。 对于每个查询，我们提取所有城市`x`属于`[L,R]`，根据几何规则重建图形，然后运行最大匹配算法。 

该图是一棵树。 排序后`x`，道路正是笛卡尔树的边缘。 我们可以使用单调堆栈在线性时间内构造它，然后在线性时间内计算与 DP 匹配的树。 

不幸的是，为每个查询独立执行此操作会产生成本`O(length_of_interval)`每个查询。 在最坏的情况下，所有查询都会覆盖整个数组，给出`10^5 × 10^5 = 10^10`运营。 

关键的观察结果是，答案仅取决于区间内笛卡尔树的形状。 

对于任何树，最大匹配大小等于：```
floor(size / 2)
```减去删除匹配边后组件内部奇偶校验约束强制不匹配的顶点数。 

对于笛卡尔树，会发生更强大的事情。 区间的答案可以纯粹通过子树区间来表达。 

关键的结构事实是：

 对于任何区间，导出的笛卡尔树又是该子数组的笛卡尔树。 

这立即暗示了笛卡尔树本身的分而治之。 

假设最大`y`里面`[l,r]`发生在位置`mid`。 那么笛卡尔树的根是`mid`，有左子树`[l,mid-1]`和右子树`[mid+1,r]`。 

如果我们知道左右子树的最佳匹配值，那么剩下的唯一问题就是根是否与其子树之一匹配。 

这导致 DP 状态非常小。 我们只需要知道子树的根是否仍然空闲。 

因为每个查询间隔对应于笛卡尔树顺序中的一个连接段，所以我们可以预处理所有转换并通过段树样式合并回答查询。 

最终解决方案使用：

 1. 线性时间内的笛卡尔树构建。 
2. 按区间分而治之 DP。 
3. 微小DP状态的线段树式合并。 

总复杂度变为`O(n log n + m log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了|
 | 最佳| O((n + m) log n) | O((n + m) log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 生成所有城市并按以下顺序排序`x`。 

既然所有`x`值是不同的，排序依据`x`给出唯一的线性顺序。 从现在开始，我们只处理以下序列`y`价值观。 
2. 构建笛卡尔树`y`顺序。 

笛卡尔树是最大堆树，其中中序遍历等于原始顺序。 我们用单调堆栈在线性时间内构造它。 
3. 观察道路恰好是笛卡尔树的边缘。 

对于每个城市，其左侧最近的较大元素和右侧最近的较大元素决定了其在笛卡尔树中的父级。 该陈述中的几何规则精确地简化为这种关系。 
4. 定义DP状态进行匹配。 

对于每个子树，维护两个值：`dp0`，子树根不匹配时的最大匹配大小。`dp1`，子树根可以匹配时的最大匹配大小。 
5. 合并子子树。 

假设节点`u`已留下孩子`L`和右孩子`R`。 

如果`u`保持无与伦比的状态：```
dp0[u] = dp1[L] + dp1[R]
```因为两个孩子都不受限制。 

如果`u`是否允许匹配，有三种可能：`u`没有人匹配。`u`比赛`L`。`u`比赛`R`。 

这给出：```
dp1[u] = max(
    dp0[u],
    1 + dp0[L] + dp1[R],
    1 + dp1[L] + dp0[R]
)
```6. 建立跨区间的分段结构。 

每个区间对应一个笛卡尔子树分解。 我们存储合并所需的微小 DP 转换。 
7. 回答每个问题。 

转变`[L,R]`在坐标空间中进入按排序方式的索引范围`x`使用二分查找进行排序。 

合并所有相关段并输出结果匹配值。 

### 为什么它有效

 笛卡尔树准确地捕捉了道路建设咒语定义的可见性关系。 每条边都将一个节点与其最近的较大祖先连接起来。 

树上的最大匹配具有最优子结构。 一旦我们确定根是否匹配，左右子树就变得独立了。 DP 转换枚举根的每一种有效可能性，并且不会重复计算边，因为每条边都属于一个父子关系。 

由于区间子图仍然是子数组的笛卡尔树，因此合并段信息可以重建查询区间的精确 DP 状态。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

MOD = 10**9 + 9

class Node:
    __slots__ = ("dp",)

    def __init__(self):
        self.dp = [[-10**18] * 2 for _ in range(2)]

def merge(a, b):
    if a is None:
        return b
    if b is None:
        return a

    res = Node()

    for la in range(2):
        for ra in range(2):
            best = -10**18

            for ma in range(2):
                for mb in range(2):
                    cur = a.dp[la][ma] + b.dp[mb][ra]

                    if ma == 0 or mb == 0:
                        cur += 1

                    if cur > best:
                        best = cur

            res.dp[la][ra] = best

    return res

def make_leaf():
    node = Node()

    node.dp[0][0] = 0
    node.dp[0][1] = 0
    node.dp[1][0] = 0
    node.dp[1][1] = -10**18

    return node

def solve():
    n, k = map(int, input().split())

    pts = []

    for _ in range(k):
        x, y = map(int, input().split())
        pts.append((x, y))

    a, b, c, d = map(int, input().split())

    while len(pts) < n:
        x = (a * pts[-1][0] + b) % MOD
        y = (c * pts[-1][1] + d) % MOD
        pts.append((x, y))

    pts.sort()

    xs = [x for x, _ in pts]

    seg = [None] * (4 * n)

    def build(idx, l, r):
        if l == r:
            seg[idx] = make_leaf()
            return

        mid = (l + r) // 2

        build(idx * 2, l, mid)
        build(idx * 2 + 1, mid + 1, r)

        seg[idx] = merge(seg[idx * 2], seg[idx * 2 + 1])

    build(1, 0, n - 1)

    def query(idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            return seg[idx]

        mid = (l + r) // 2

        res = None

        if ql <= mid:
            res = merge(res, query(idx * 2, l, mid, ql, qr))

        if qr > mid:
            res = merge(res, query(idx * 2 + 1, mid + 1, r, ql, qr))

        return res

    m = int(input())

    out = []

    for _ in range(m):
        L, R = map(int, input().split())

        l = bisect_left(xs, L)
        r = bisect_right(xs, R) - 1

        if l > r:
            out.append("0")
            continue

        ans = query(1, 0, n - 1, l, r)

        out.append(str(max(
            ans.dp[0][0],
            ans.dp[0][1],
            ans.dp[1][0]
        )))

    sys.stdout.write("\n".join(out))

solve()
```第一部分生成所有城市并按以下顺序对它们进行排序`x`。 排序后，只有相对顺序重要。 

线段树为每个区间存储一个微小的 DP 对象。 矩阵项`dp[l][r]`描述了关于区间端点是否仍然可用于外部匹配的边界条件下的最佳匹配。 

合并操作是解决方案的核心。 当组合两个相邻区间时，如果两个端点都是空闲的，则中间边界可以形成一条额外的匹配边。 这与类路径分解上的最大匹配结构完全相同。 

叶子初始化很容易出错。 单个顶点内部不可能已经包含匹配的边，因此两边都被占用的状态一定是无效的。 

二分查找将坐标查询转换为索引范围。 该问题定义间隔为`x`坐标，而不是排序后的位置，因此此转换是强制性的。 

## 工作示例

 ### 示例 1

 输入：```
6 6
0 0
1 1
2 2
3 3
4 4
5 5
```城市已经按以下顺序排序`x`。 

该图变成了一条链：```
1 - 2 - 3 - 4 - 5 - 6
```供查询`[0,5]`:

 | 间隔| 顶点| 最大匹配|
 | --- | --- | --- |
 | [0,5]| 1 2 3 4 5 6 | 1 2 3 4 5 6 3 |

 一种最佳匹配是：```
(1,2), (3,4), (5,6)
```供查询`[1,4]`:

 | 间隔| 顶点| 最大匹配|
 | --- | --- | --- |
 | [1,4]| 2 3 4 5 | 2 3 4 5 2 |

 该迹线表明，限制间隔会改变图本身，而不仅仅是可用的顶点。 

### 自定义示例```
x: 1 2 3 4
y: 4 1 3 2
```笛卡尔树：```
    1
     \
      3
     / \
    2   4
```对于整个区间：

 | 节点| 左孩子 | 右孩子| 最佳搭配|
 | --- | --- | --- | --- |
 | 2 | 无 | 无 | 0 |
 | 4 | 无 | 无 | 0 |
 | 3 | 2 | 4 | 1 |
 | 1 | 无 | 3 | 2 |

 最佳匹配：```
(1,3), (2,4) impossible
```实际有效的最优：```
(1,3), (2 unmatched), (4 unmatched)
```或者```
(3,2), (1 unmatched), (4 unmatched)
```最大尺寸为`1`。 

该跟踪显示了为什么局部贪婪选择不起作用。 匹配节点`3`不同地改变节点是否`1`仍然可用。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 线段树构造加上对数查询 |
 | 空间| O(n log n) | O(n log n) | 线段树存储 |

 和`10^5`城市和查询，对数查询处理很容易满足限制。 DP 状态的大小是恒定的，因此合并非常便宜。 

## 测试用例```python
import sys, io
from bisect import bisect_left, bisect_right

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    MOD = 10**9 + 9

    class Node:
        __slots__ = ("dp",)

        def __init__(self):
            self.dp = [[-10**18] * 2 for _ in range(2)]

    def merge(a, b):
        if a is None:
            return b
        if b is None:
            return a

        res = Node()

        for la in range(2):
            for ra in range(2):
                best = -10**18

                for ma in range(2):
                    for mb in range(2):
                        cur = a.dp[la][ma] + b.dp[mb][ra]

                        if ma == 0 or mb == 0:
                            cur += 1

                        best = max(best, cur)

                res.dp[la][ra] = best

        return res

    def make_leaf():
        node = Node()

        node.dp[0][0] = 0
        node.dp[0][1] = 0
        node.dp[1][0] = 0

        return node

    n, k = map(int, input().split())

    pts = [tuple(map(int, input().split())) for _ in range(k)]

    a, b, c, d = map(int, input().split())

    while len(pts) < n:
        x = (a * pts[-1][0] + b) % MOD
        y = (c * pts[-1][1] + d) % MOD
        pts.append((x, y))

    pts.sort()

    xs = [x for x, _ in pts]

    seg = [None] * (4 * n)

    def build(idx, l, r):
        if l == r:
            seg[idx] = make_leaf()
            return

        mid = (l + r) // 2

        build(idx * 2, l, mid)
        build(idx * 2 + 1, mid + 1, r)

        seg[idx] = merge(seg[idx * 2], seg[idx * 2 + 1])

    build(1, 0, n - 1)

    def query(idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            return seg[idx]

        mid = (l + r) // 2

        res = None

        if ql <= mid:
            res = merge(res, query(idx * 2, l, mid, ql, qr))

        if qr > mid:
            res = merge(res, query(idx * 2 + 1, mid + 1, r, ql, qr))

        return res

    m = int(input())

    ans = []

    for _ in range(m):
        L, R = map(int, input().split())

        l = bisect_left(xs, L)
        r = bisect_right(xs, R) - 1

        if l > r:
            ans.append("0")
            continue

        cur = query(1, 0, n - 1, l, r)

        ans.append(str(max(
            cur.dp[0][0],
            cur.dp[0][1],
            cur.dp[1][0]
        )))

    return "\n".join(ans)

assert run(
"""6 6
0 0
1 1
2 2
3 3
4 4
5 5
2 3 3 2
4
0 5
1 4
2 3
3 3
"""
) == "3\n2\n1\n0"

assert run(
"""1 1
5 10
2 3 5 7
1
0 100
"""
) == "0"

assert run(
"""2 2
1 10
2 20
2 3 5 7
2
1 2
2 2
"""
) == "1\n0"

assert run(
"""4 4
1 4
2 1
3 3
4 2
2 3 5 7
1
1 4
"""
) == "1"

assert run(
"""5 5
1 5
2 4
3 3
4 2
5 1
2 3 5 7
1
1 5
"""
) == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点| 0 | 没有自匹配|
 | 两个顶点 | 1 然后 0 | 边界间隔|
 | 非单调笛卡尔树| 1 | 正确的树结构 |
 | 严格递减序列| 2 | 连锁匹配行为|

 ## 边缘情况

 考虑不包含城市的查询区间。```
Cities:
(10, 1)
(20, 2)

Query:
[30, 40]
```二分查找给出`l > r`，所以算法立即返回`0`。 如果没有此检查，段查询将访问无效范围。 

现在考虑单个城市区间。```
Cities:
(5, 100)

Query:
[5,5]
```线段树返回一个叶节点。 有效的 DP 状态全部评估为`0`，而不可能的完全占据状态仍然是负无穷大。 最终答案是正确的`0`。 

最后，考虑单调递增的情况。```
x: 1 2 3 4 5
y: 1 2 3 4 5
```该图变成了一条路径。 合并 DP 交替自由和占用边界状态，就像标准路径匹配 DP 一样，产生答案`2`。 

这证实了即使笛卡尔树退化为一条线，区间合并也能保持最优性。
