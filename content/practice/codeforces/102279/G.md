---
title: "CF 102279G - 越来越高"
description: "有两棵树。 B21最优地选择他的树的根，试图使其高度尽可能大。 Lowie 从 B21 的角度敌对地选择了他的树的根，因此 B21 只需要知道 Lowie 的树是否存在某个根，使得 B21 的……"
date: "2026-08-16T19:19:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "G"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 105
verified: true
draft: false
---

[CF 102279G - 越来越高](https://codeforces.com/problemset/problem/102279/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有两棵树。 B21最优地选择他的树的根，试图使其高度尽可能大。 Lowie 从 B21 的角度敌对地选择了他的树的根，因此 B21 只需要知道 Lowie 的树是否存在某个根，使 B21 的结果高度严格更大。 

有根树的高度以最长的根到顶点路径上的顶点来测量。 使用边缘测量的距离会很方便。 如果从根到任意顶点的最长距离是`h`边，树的高度为`h + 1`顶点。 额外的`1`出现在两棵树中，所以当我们比较它们的高度时它就消失了。 

对于 B21，最大化所有可能的根的高度与查找树的直径完全相同。 如果直径有`D`边缘，选择直径端点作为根，给出高度`D + 1`。 

对于 Lowie，我们需要相反的数量。 B21想知道是否有某种根源使得Lowie的身高尽可能小。 从根到每个顶点的最小可能最大距离是树的半径，即`ceil(D / 2)`当直径为`D`。 因此，从 B21 的角度来看，Lowie 的最佳高度是`ceil(D / 2) + 1`。 

输入包含 B21 树，后跟 Lowie 树。 一棵树与`N`顶点有`N - 1`尽管存档的声明文本说`N`边缘线。 示例使用`N - 1`边，这是唯一与树的定义一致的格式，因此实现如下`N - 1`和`M - 1`边缘。 

限制足够大，二次遍历是不可能的。 高达`10^5`B21 树中的顶点和`2 * 10^5`Lowie 树中的顶点`O(N^2 + M^2)`方法可能需要周围`10^11`邻接访问。 官方限制为 256 MB 内存的情况下仅为 1 秒，因此预期的解决方案必须以线性时间处理每棵树。 

第一个边缘情况是单顶点 B21 树。```
1
2
1 2
```B21的直径为零边，所以他的最大高度是`1`。 洛伊树的一条边直径为，所以即使它的最小可能高度也是`2`。 B21赢不了，答案是`FF`。 当 DFS 从不存在的邻居开始或将直径初始化为`1`。 

第二种边缘情况是恰好在边界处绘制。```
4
1 2
2 3
3 4
7
1 2
2 3
3 4
4 5
5 6
6 7
```B21的直径是`3`，而洛伊直径是`6`。 Lowie 的最小半径为`ceil(6 / 2) = 3`，这样两个玩家都可以获得高度`4`。 正确答案是`FF`，因为平局不算获胜。 粗心的实现使用`>=`而不是`>`会错误地打印`GGEZ`。 

第三种边缘情况是奇数直径。```
4
1 2
2 3
3 4
6
1 2
2 3
3 4
4 5
5 6
```直径是`3`和`5`。 Lowie 的最小半径为`ceil(5 / 2) = 3`，所以最大和最小相关高度都是`4`。 答案又是`FF`。 这捕获了意外使用整数除法的实现`D / 2`而不是天花板划分`(D + 1) / 2`。 

## 方法

 直接的解决方案是尝试所有可能的根。 对于每个根，运行 DFS 或 BFS 并找到最远的顶点。 取这些值中的最大值给出 B21 的最佳高度，而取最小值给出 Lowie 可能意外选择的最佳根。 这是正确的，因为树高的定义正是距所选根的最大距离。 

问题是重复遍历。 遍历一个`N`- 顶点树检查`2(N - 1)`邻接条目。 因此，为每个根运行一次需要`2N(N - 1)`邻接访问。 对洛伊树做同样的事情会得到另一个`2M(M - 1)`。 在`N = 10^5`和`M = 2 * 10^5`，这是关于`99,999,400,000`邻接访问，远远超出了时限。 

蛮力方法之所以有效，是因为每个根独立地确定一个树的高度，但我们实际上不需要检查每个根。 树的结构为我们提供了两个全局量，它们准确地概括了我们所需要的内容。 

通过改变根部可获得的最大高度就是直径。 如果直径端点是`a`和`b`，根于`a`达到`b`在最大可能距离处，因此所得高度是直径加一。 

通过改变根获得的最小高度就是半径。 每个顶点必须靠近所选的根，并且最好的根是树的中心。 中心位于直径的一半，因此对于直径`D`最小可能的最大距离是`ceil(D / 2)`。 

这将整个问题简化为计算两个直径。 通过两次图遍历可以找到树的直径。 从任意顶点开始，找到最远的顶点`a`。 然后从`a`并找到最远的顶点`b`。 距离`a`到`b`是直径。 

让`D_B`是 B21 的边缘直径，`D_L`是边缘的洛伊直径。 B21 获胜的确切时间`D_B + 1 > ceil(D_L / 2) + 1`这简化为`D_B > ceil(D_L / 2)`。 

比较结果与两棵树的大小呈线性关系。 这也是官方竞赛社论中描述的方法，它将问题简化为最大和最小可能的树高度，并通过每棵树两次遍历来计算所需的直径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(N² + M²)`|`O(N + M)`| 太慢了 |
 | 最佳 |`O(N + M)`|`O(N + M)`| 已接受 |

 ## 算法演练

 1. 读取B21的树并构建其邻接表。 一棵树与`N`顶点正好有`N - 1`边，所以这些边属于 B21 的图。 
2. 通过两次遍历计算 B21 的直径。 从任意一个顶点开始，找到最远的顶点`a`，然后从`a`并找到最远的顶点`b`。 距离`a`到`b`是`D_B`，边缘的直径。 
3. 读取Lowie 树并构建它的邻接表。 相同的树属性意味着它包含`M - 1`边缘。 
4. 计算洛伊直径`D_L`使用同样的二次遍历方法。 
5. 将洛伊直径转换为距根部的最小可能最大距离。 直径中心的根部最小化其最远距离，给出半径`ceil(D_L / 2)`。 在整数算术中，这是`(D_L + 1) // 2`。 
6、比较B21的最大距离`D_B`洛伊的最小可能最大距离。 B21 获胜的确切时间`D_B > (D_L + 1) // 2`。 严格的不平等是必要的，因为平等会产生平局。 
7. 打印`GGEZ`当不等式成立并且`FF`否则。 

### 为什么它有效

 关键的不变量是每个有根树的高度可以表示为一加上距其根的最大边缘距离。 所有根中最大的此类值是直径加一，因为直径端点可以以直径距离到达相对端点。 最小的值是半径加一，并且每个树中心都有偏心率`ceil(D / 2)`， 在哪里`D`是直径。 因此，当 B21 的直径严格大于 Lowie 半径时，它就有一个获胜的根选择。 两次遍历过程精确地计算每个直径，因此最终的比较不会错过可能的获胜根或在只有平局可能时宣布获胜。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def diameter(graph):
    n = len(graph)

    def farthest(start):
        dist = [-1] * n
        dist[start] = 0
        stack = [start]
        far = start

        while stack:
            u = stack.pop()
            if dist[u] > dist[far]:
                far = u

            for v in graph[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    stack.append(v)

        return far, dist[far]

    if n == 1:
        return 0

    a, _ = farthest(0)
    _, d = farthest(a)
    return d

def solve():
    n = int(input())
    b21 = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        b21[u].append(v)
        b21[v].append(u)

    m = int(input())
    lowie = [[] for _ in range(m)]

    for _ in range(m - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        lowie[u].append(v)
        lowie[v].append(u)

    db = diameter(b21)
    dl = diameter(lowie)

    lowie_radius = (dl + 1) // 2

    if db > lowie_radius:
        print("GGEZ")
    else:
        print("FF")

if __name__ == "__main__":
    solve()
```这`diameter`函数完全执行演练中描述的两次遍历。 第一次遍历只需要找出最远的顶点，第二次遍历则记录该顶点到每个可达顶点的距离并返回最大的那个。 

该图是一棵树，因此简单的迭代 DFS 就足够了。 不需要 BFS，因为每条边都具有相同的单位成本，并且我们只需要未加权树中的最远距离。 使用显式堆栈还可以避免包含以下内容的路径上的 Python 递归深度问题：`10^5`或者`2 * 10^5`顶点。 

这`n == 1`检查是必要的，因为单顶点树的直径为零。 第一次遍历仍然有效，但显式处理这种情况可以使定义清晰，并避免依赖空邻接列表的通用最远节点逻辑的行为。 

从直径到半径的转换使用`(dl + 1) // 2`。 对于均匀直径，例如`6`，这给出了`3`。 对于奇数直径，例如`5`，它给出`3`，这是所需的上限而不是地板。 

最后的比较是严格的。 如果`db == lowie_radius`，所得高度相等，因此输出必须是`FF`。 

顶点索引从从一开始的输入转换为从零开始的 Python 索引。 Python 中不可能出现整数溢出，并且所有距离最多为`2 * 10^5 - 1`。 

## 工作示例

 ### 示例 1

 B21的树有边```
1-2, 1-3, 2-4, 2-5
```第一次遍历可以从顶点开始`1`。 一个可能的最远顶点是`4`，在距离处`2`。 开始于`4`，最远的顶点是`3`，在距离处`3`。 因此 B21 的直径为`3`。 

对于 Lowie 树，从`1`。 可能的最远顶点是`5`，在距离处`2`。 开始于`5`, 顶点`7`是在距离`4`，给出洛伊直径`4`。 其半径为`ceil(4 / 2) = 2`。 

| 树| 第一次开始| 第一个最远| 第二次开始| 第二远| 直径| 半径 |
 | ---| ---| ---| ---| ---| ---| ---|
 | B21 | 1 | 4 | 4 | 3 | 3 | 不需要|
 | 洛伊| 1 | 5 | 5 | 7 | 4 | 2 |

 比较的是`3 > 2`，因此B21可以选择一个直径端点作为他的根，并在有利的根选择下获得严格大于Lowie高度的高度。 答案是`GGEZ`。 

### 示例 2

 B21的树没有变化，所以它的直径保持不变`3`。 

对于 Lowie 树，从`1`，一个最远的顶点可以是`5`。 开始于`5`, 顶点`7`是在距离`6`，所以 Lowie 直径为`6`。 其半径为`ceil(6 / 2) = 3`。 

| 树| 第一次开始| 第一个最远| 第二次开始| 第二远| 直径| 半径 |
 | ---| ---| ---| ---| ---| ---| ---|
 | B21 | 1 | 4 | 4 | 3 | 3 | 不需要|
 | 洛伊| 1 | 5 | 5 | 7 | 6 | 3 |

 现在的比较是`3 > 3`，这是错误的。 双方玩家均可获得身高`4`，所以结果是平局，答案是`FF`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N + M)`| 每棵树都会被遍历两次，并且每次遍历都会检查每个顶点和边恒定的次数。 |
 | 空间|`O(N + M)`| 两个邻接表和遍历距离数组存储线性数量的顶点和边。 |

 最大的树有`2 * 10^5`顶点，因此该算法仅粗略地执行恒定数量的线性传递`3 * 10^5`顶点及其边。 这比二次暴力法更符合预期的 1 秒和 256 MB 限制。 

## 测试用例

 以下测试工具使用相同的`solve`实现并替换标准输入和输出，以便可以使用断言检查每种情况。```python
import sys
import io
from contextlib import redirect_stdout

def diameter(graph):
    n = len(graph)

    def farthest(start):
        dist = [-1] * n
        dist[start] = 0
        stack = [start]
        far = start

        while stack:
            u = stack.pop()

            if dist[u] > dist[far]:
                far = u

            for v in graph[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    stack.append(v)

        return far, dist[far]

    if n == 1:
        return 0

    a, _ = farthest(0)
    _, d = farthest(a)
    return d

def solve():
    input = sys.stdin.readline

    n = int(input())
    b21 = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        b21[u].append(v)
        b21[v].append(u)

    m = int(input())
    lowie = [[] for _ in range(m)]

    for _ in range(m - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        lowie[u].append(v)
        lowie[v].append(u)

    db = diameter(b21)
    dl = diameter(lowie)

    if db > (dl + 1) // 2:
        print("GGEZ")
    else:
        print("FF")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    output = io.StringIO()
    try:
        with redirect_stdout(output):
            solve()
    finally:
        sys.stdin = old_stdin

    return output.getvalue().strip()

# Provided sample 1
sample1 = """\
5
1 2
1 3
2 4
2 5
7
1 2
2 5
3 6
2 4
1 3
3 7
"""
assert run(sample1) == "GGEZ", "sample 1"

# Provided sample 2
sample2 = """\
5
1 2
1 3
2 4
2 5
7
1 2
1 3
3 4
4 5
2 6
6 7
"""
assert run(sample2) == "FF", "sample 2"

# Minimum-size B21 tree
case_min = """\
1
2
1 2
"""
assert run(case_min) == "FF", "single vertex B21 tree"

# Exact draw boundary
case_draw = """\
4
1 2
2 3
3 4
7
1 2
2 3
3 4
4 5
5 6
6 7
"""
assert run(case_draw) == "FF", "equal B21 diameter and Lowie radius"

# Odd Lowie diameter
case_odd = """\
4
1 2
2 3
3 4
6
1 2
2 3
3 4
4 5
5 6
"""
assert run(case_odd) == "FF", "odd diameter requires ceiling"

# Branching tree with a very small diameter
case_star = """\
3
1 2
1 3
4
1 2
1 3
1 4
"""
assert run(case_star) == "GGEZ", "star-shaped trees"

# Maximum-size generated case
def make_max_case():
    n = 100000
    m = 200000

    parts = [str(n)]
    for i in range(1, n):
        parts.append(f"{i} {i + 1}")

    parts.append(str(m))
    for i in range(1, m):
        parts.append(f"{i} {i + 1}")

    return "\n".join(parts) + "\n"

max_case = make_max_case()
assert run(max_case) == "FF", "maximum-size paths"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`顶点与 2 顶点树 |`FF`| 最小尺寸树和零直径 |
 | B21 路径 4 与 Lowie 路径 7 |`FF`| B21 直径和 Lowie 半径完全相等 |
 | B21 路径 4 与 Lowie 路径 6 |`FF`| 奇数直径的天花板划分|
 | 两颗星 |`GGEZ`| 分枝树和小直径|
 | 路径与`100000`和`200000`顶点|`FF`| 最大约束和线性时间行为 |

 ## 边缘情况

 对于单顶点的情况，B21的树没有边，所以`D_B = 0`。 Lowie 的二顶点树有`D_L = 1`，给出半径`(1 + 1) // 2 = 1`。 比较就变成了`0 > 1`，这是假的，所以算法打印`FF`。 明确的`n == 1`分支进入`diameter`直接返回零。 

对于精确的绘制边界，请考虑```
4
1 2
2 3
3 4
7
1 2
2 3
3 4
4 5
5 6
6 7
```第一棵树的直径`3`。 第二个有直径`6`，所以它的半径是`(6 + 1) // 2 = 3`。 最终测试是`3 > 3`，这是错误的。 严格比较正确地拒绝了平局。 

对于奇数 Lowie 直径，请考虑```
4
1 2
2 3
3 4
6
1 2
2 3
3 4
4 5
5 6
```B21的直径是`3`。 洛伊直径为`5`，最好的根是两个中心顶点之一，给出半径`3`。 表达式`(5 + 1) // 2`产生`3`，因此算法正确处理了上限操作。 自从`3 > 3`是假的，它打印`FF`。 

对于分支树，考虑```
3
1 2
1 3
4
1 2
1 3
1 4
```两棵树都是星星。 它们的直径是`2`，所以洛伊半径为`1`。 B21直径`2`严格大于`1`，算法打印`GGEZ`。 这说明了为什么解仅取决于直径，而不取决于树是路径还是有许多分支。 

对于最大尺寸的情况，两棵树都是路径，其中`100000`和`200000`分别为顶点。 它们的直径是`99999`和`199999`。 洛伊半径为`(199999 + 1) // 2 = 100000`，而B21的直径仅为`99999`，所以答案是`FF`。 该实现通过四次线性遍历处理整个输入，并且从不构造二次距离矩阵，这正是约束所需的行为。
