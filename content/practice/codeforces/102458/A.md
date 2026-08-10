---
title: "CF 102458A - 丹尼尔和永久恐惧症"
description: "如果我们只看坐标，几何故事就会变得简单得多。 假设 Daniel 已经记录了一个点 (u, v)。 每当 x = u 或 y = v 时，必须避免地雷 (x, y)，因为连接两点的线段是垂直或水平的。"
date: "2026-08-09T02:37:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102458
codeforces_index: "A"
codeforces_contest_name: "Hanoi final contest"
rating: 0
weight: 102458
solve_time_s: 390
verified: true
draft: false
---

[CF 102458A - 丹尼尔和 Perpendophobia](https://codeforces.com/problemset/problem/102458/A)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 如果我们只看坐标，几何故事就会变得简单得多。 假设丹尼尔已经记录了一个点`(u, v)`。 一个矿井`(x, y)`任何时候都必须避免`x = u`或者`y = v`，因为连接两点的线段是垂直或水平的。 换句话说，每个记录点都使其整个垂直线和水平线无法用于未来的地雷。 

起源是在丹尼尔访问任何东西之前记录的，所以每个矿井都带有`x = 0`或者`y = 0`立即无法使用。 每当丹尼尔访问矿山时`(x, y)`，坐标值`x`永远不可用，坐标值`y`也将永远无法使用。 

这给出了问题的真实组合结构。 如果我们决定访问多个矿井，则没有两个访问过的矿井可能具有相同的`x`坐标，并且任何两个都不能有相同的`y`协调。 相反，任何满足这两个条件的地雷集合都可以按任意顺序访问。 参观完一处矿山后，只剩下自己的`x`和`y`值被禁止，因此两个坐标仍未使用的另一个地雷仍然是合法的。 

因此，任务是选择尽可能多的地雷，使得所有被选择的地雷都被选中。`x`坐标是不同的并且全部被选择`y`在丢弃位于任一轴上的地雷后，坐标是不同的。 

最多可以有`80,000`地雷，而坐标可以大到`10^9`。 较大的坐标范围意味着我们无法构建直接按坐标索引的数组。 更重要的是，`N = 80,000`排除二次算法：偶数`O(N^2)`需要大约`6.4 * 10^9`在最坏的情况下进行配对检查。 我们需要一种接近线性或可能的算法`O(N sqrt N)`。 

有几种边缘情况很容易被错误处理。 考虑```
1
0 7
```答案是`0`，因为原点已经记录了`x = 0`，所以这个矿立即被禁止。 仅检查当前矿井是否未勘探的解决方案会错误地计算它。 

现在考虑```
3
1 1
1 2
2 3
```答案是`2`。 我们可以参观`(1, 1)`进而`(2, 3)`。 我们不能同时访问这两个地方`(1, 1)`和`(1, 2)`，因为在第一次访问每个矿井后`x = 1`是被禁止的。 一个粗心的解决方案，只检查是否`y`坐标不同可以算全部三个。 

另一个微妙的情况是```
4
0 1
1 2
2 3
3 0
```答案是`2`。 接触轴的两​​个地雷从一开始就无法使用，留下`(1, 2)`和`(2, 3)`。 他们有不同的`x`和`y`坐标，因此两者都可以访问。 简单地将每个输入地雷视为可用边缘会过度计算。 

## 方法

 直接的暴力解决方案可以模拟每个可能的访问序列。 在每个状态，它都会检查所有地雷并递归地选择当前合法的每个地雷。 这是正确的，因为考虑了每个合法序列，因此最大数量的访问过的地雷必须出现在搜索中。 

问题在于序列的数量。 在可以选择许多地雷的配置中，搜索可以探索几乎所有地雷的排列`N`mines. 可能的前缀数量约为`1 + N + N(N-1) + ... + N!`,

 这是`O(N!)`。 即使检查候选人的时间是恒定的，`N!`已经是无望了。 在`N = 20`,`20!`是关于`2.43 * 10^18`，远远超出任何可执行的东西。 

暴力破解之所以有效，是因为访问只会改变可用的坐标值。 这一观察让我们完全抛弃了几何形状。 赋予每一个独特的`x`坐标左侧的一个顶点和每个不同的顶点`y`坐标右侧的一个顶点。 每个矿井`(x, y)`成为连接其的边缘`x`顶点到它的`y`顶点。 

现在选择矿井就意味着选择其相应的边缘。 当两个矿井的边不共享端点时，它们都可以被精确访问。 所以有效的地雷集合正是这个二分图中的匹配。 

因此，丹尼尔可以探索的最大地雷数量就是最大二分匹配的大小。 地雷与`x = 0`或者`y = 0`被省略，因为这些坐标已经被记录的原点占据。 

一个简单的增广路径匹配算法会重复搜索整个图，并且可以变成二次的。 高达`80,000`边，合适的实现是 Hopcroft-Karp，它批量查找增广路径并运行`O(E sqrt V)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N!) | O(N) 递归加状态 | 太慢了|
 | 最佳| O(N 开方 N) | O(N) | 已接受 |

 ## 算法演练

 1. 读取所有地雷并丢弃所有地雷`x = 0`或者`y = 0`。 原点已经记录了这两个坐标值，因此永远无法选择这些地雷。 
2. 压缩剩余的不同的`x`坐标和不同`y`坐标转换为连续的整数 ID。 原始坐标可以大到`10^9`，但只有坐标之间的相等才重要，因此它们的实际大小无关紧要。 
3. 创建二部图。 对于每个剩余的地雷`(x, y)`，从压缩顶点添加一条边表示`x`到代表的顶点`y`。 每条边恰好对应一个地雷。 
4. 维护`pair_left[x]`，当前与左顶点匹配的右顶点，以及`pair_right[y]`，左顶点当前与右顶点匹配。 不匹配的顶点表示为`-1`。 
5. 运行 Hopcroft-Karp。 首先从每个不匹配的左顶点执行 BFS。 BFS 通过交替不匹配和匹配的边来构建层，并记录可以到达自由右顶点的最短距离。 
6. 从每个当前不匹配的左顶点运行 DFS，仅遵循尊重 BFS 层的边。 每当 DFS 到达不匹配的右顶点时，就会找到一条增广路径，因此沿着该路径的所有边都可以翻转，并且匹配大小增加 1。 
7. 重复 BFS 和 DFS 阶段，直到不存在增广路径。 此时当前的匹配是最大的，所以它的大小就是答案。 

为什么它有效可以通过匹配不变量来捕获。 每时每刻，选定的边都代表具有成对不同的地雷`x`和`y`协调，从而形成可行的勘探计划。 每当 Hopcroft-Karp 找到增广路径时，翻转其边缘即可保留匹配属性，同时将其大小恰好增加 1。 当 BFS 无法再找到增广路径时，增广路径定理表明不存在更大的匹配。 由于这里的匹配和可行的地雷集合是完全相同的对象，因此最终的匹配大小正是丹尼尔可以探索的最大地雷数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def maximum_mines(data):
    it = iter(map(int, data.split()))
    n = next(it)

    mines = []
    xs = {}
    ys = {}

    for _ in range(n):
        x = next(it)
        y = next(it)

        # The origin has already forbidden x = 0 and y = 0.
        if x == 0 or y == 0:
            continue

        if x not in xs:
            xs[x] = len(xs)
        if y not in ys:
            ys[y] = len(ys)

        mines.append((xs[x], ys[y]))

    nx = len(xs)
    ny = len(ys)

    graph = [[] for _ in range(nx)]
    for x, y in mines:
        graph[x].append(y)

    pair_left = [-1] * nx
    pair_right = [-1] * ny
    dist = [-1] * nx

    from collections import deque

    def bfs():
        q = deque()
        found = False

        for u in range(nx):
            if pair_left[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        while q:
            u = q.popleft()

            for v in graph[u]:
                matched_u = pair_right[v]

                if matched_u == -1:
                    found = True
                elif dist[matched_u] == -1:
                    dist[matched_u] = dist[u] + 1
                    q.append(matched_u)

        return found

    sys.setrecursionlimit(max(1_000_000, nx * 2 + 10))

    def dfs(u):
        for v in graph[u]:
            matched_u = pair_right[v]

            if matched_u == -1 or (
                dist[matched_u] == dist[u] + 1 and dfs(matched_u)
            ):
                pair_left[u] = v
                pair_right[v] = u
                return True

        dist[u] = -1
        return False

    matching = 0

    while bfs():
        for u in range(nx):
            if pair_left[u] == -1 and dfs(u):
                matching += 1

    return str(matching)

def main():
    data = sys.stdin.buffer.read()
    sys.stdout.write(maximum_mines(data))

if __name__ == "__main__":
    main()
```第一遍在读取地雷时压缩坐标。 使用字典是必要的，因为坐标范围可达`10^9`; 压缩ID最多为`N - 1`。 

该图包含每个可用矿井的一条边。 压缩后不需要存储原始坐标，因为算法需要的唯一操作是测试两个坐标是否相等。`pair_left`和`pair_right`从两个方向描述当前的匹配。 拥有两个阵列可以有效地遵循交替路径。 如果右顶点已经匹配，`pair_right[v]`立即告诉我们接下来必须访问哪个左顶点。 

BFS 构建了 Hopcroft-Karp 使用的层。 不匹配的右顶点意味着当前 BFS 已经找到增广路径的可能端点。 然后，DFS 仅搜索分层结构，避免不能属于最短增广路径的任意路径。 

增加Python的递归限制后，递归DFS是安全的。 图表与`80,000`边可以产生很长的交替路径，因此依赖 Python 的默认递归限制是不安全的。 

Python 中不存在整数溢出问题，并且坐标本身从不用于算术。 答案最多是`N`，所以匹配的计数器也很小。 

## 工作示例

 对于第一个样本，```
5
100 400
200 200
200 300
300 400
400 100
```压缩图的左顶点代表`100, 200, 300, 400`和右顶点代表`100, 200, 300, 400`。 

| 步骤| 左顶点 | 选择右顶点 | 匹配|
 | --- | --- | --- | --- |
 | 1 | 100 | 100 400 |`(100,400)`|
 | 2 | 200 | 200 200 | 200`(100,400), (200,200)`|
 | 3 | 300 | 300 400 | 不能保留这个，`400`已被占用 |
 | 3 | 300 | 300 400 通过重新分配 | 如果可能的话重新安排|
 | 3 | 300 | 300 当前选择之后没有免费的| 尝试另一条增广路径 |
 | 3 | 400 | 100 | 100`(100,400), (200,200), (400,100)`|

 最大匹配有大小`3`。 以三矿为例`(100,400)`,`(200,200)`， 和`(400,100)`可以参观。 尝试添加`(300,400)`失败是因为它`y = 400`与第一个地雷发生冲突。 

该跟踪说明了为什么这不仅仅是一个计算不同的问题`x`和`y`坐标。 边缘决定哪些组合实际上可用，因此需要匹配算法。 

对于第二个样本，```
4
0 1
1 2
2 3
3 0
```两颗轴雷立即消失。 

| 步骤| 我的| 行动| 配套尺寸|
 | --- | --- | --- | --- |
 | 1 |`(0,1)`| 丢弃因为`x = 0`| 0 |
 | 2 |`(1,2)`| 添加到匹配| 1 |
 | 3 |`(2,3)`| 添加到匹配| 2 |
 | 4 |`(3,0)`| 丢弃因为`y = 0`| 2 |

 答案是`2`。 两个幸存的地雷使用不同的`x`坐标和不同`y`坐标，因此它们形成有效的匹配并且都可以被探索。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N 开方 N) | 该图最多有`N`边缘和`O(N)`顶点，Hopcroft-Karp 取`O(E sqrt V)`|
 | 空间| O(N) | 坐标图、图边、匹配数组、距离和 BFS 队列都是线性的 |

 和`N <= 80,000`，图中最多包含`80,000`边缘和至多`160,000`压缩顶点。 该解决方案避免了对地雷对的每次二次扫描，并且仅使用线性图存储，因此它适合预期的大型子任务和`512 MB`内存限制。 

## 测试用例```python
import sys
from collections import deque

def solve_string(data: str) -> str:
    it = iter(map(int, data.split()))
    n = next(it)

    mines = []
    xs = {}
    ys = {}

    for _ in range(n):
        x = next(it)
        y = next(it)

        if x == 0 or y == 0:
            continue

        if x not in xs:
            xs[x] = len(xs)
        if y not in ys:
            ys[y] = len(ys)

        mines.append((xs[x], ys[y]))

    nx = len(xs)
    ny = len(ys)

    graph = [[] for _ in range(nx)]
    for x, y in mines:
        graph[x].append(y)

    left = [-1] * nx
    right = [-1] * ny
    dist = [-1] * nx

    def bfs():
        q = deque()
        found = False

        for u in range(nx):
            if left[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        while q:
            u = q.popleft()

            for v in graph[u]:
                w = right[v]

                if w == -1:
                    found = True
                elif dist[w] == -1:
                    dist[w] = dist[u] + 1
                    q.append(w)

        return found

    sys.setrecursionlimit(max(1_000_000, nx * 2 + 10))

    def dfs(u):
        for v in graph[u]:
            w = right[v]

            if w == -1 or (
                dist[w] == dist[u] + 1 and dfs(w)
            ):
                left[u] = v
                right[v] = u
                return True

        dist[u] = -1
        return False

    ans = 0

    while bfs():
        for u in range(nx):
            if left[u] == -1 and dfs(u):
                ans += 1

    return str(ans)

def run(inp: str) -> str:
    return solve_string(inp)

# Provided sample 1
assert run(
    """5
100 400
200 200
200 300
300 400
400 100
"""
) == "3", "sample 1"

# Provided sample 2
assert run(
    """4
0 1
1 2
2 3
3 0
"""
) == "2", "sample 2"

# Minimum-size input
assert run(
    """1
7 9
"""
) == "1", "single usable mine"

# All mines share the same x coordinate
assert run(
    """5
1 1
1 2
1 3
1 4
1 5
"""
) == "1", "all equal x coordinates"

# Axis boundaries plus a valid pair
assert run(
    """5
0 10
10 0
1 2
2 3
3 4
"""
) == "3", "axis mines must be ignored"

# Alternating-path case
assert run(
    """4
1 1
1 2
2 1
3 3
"""
) == "3", "augmenting path must rearrange an earlier match"

# Maximum-size input: 80,000 distinct independent mines
large = ["80000"]
large.extend(f"{i} {i}" for i in range(1, 80001))
assert run("\n".join(large)) == "80000", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7 9`|`1`| 最小输入和基本单边匹配 |
 | 五个矿井`x = 1`|`1`| 重复坐标不能访问两次 |
 | 两个轴上都有地雷加上`(1,2),(2,3),(3,4)`|`3`| 原点禁止坐标的正确处理 |
 |`(1,1),(1,2),(2,1),(3,3)`|`3`| 增广路径可以取代早期的匹配选择 |
 |`80,000`对角地雷|`80,000`| 最大输入大小和线性图构造 |

 ## 边缘情况

 在构建图表之前处理轴上的地雷。 为了```
1
0 7
```该地雷被废弃是因为`x`坐标已存在于原点中。 没有图边剩余，因此 Hopcroft-Karp 返回`0`。 同样的推理也适用于矿山，例如`(8,0)`。 

当许多地雷具有相同的坐标时，它们都成为与一个图顶点相关的边。 为了```
5
1 1
1 2
1 3
1 4
1 5
```只有 1 个左顶点和 5 个右顶点。 匹配只能包含一条边，因为每条边都共享该左端点。 算法返回`1`, exactly matching the fact that visiting any one of these mines permanently forbids the other four.

 The origin itself is not an input mine, but its coordinates still matter. 在```
4
0 1
1 2
2 3
3 0
```第一个和最后一个地雷被移除，因为它们与记录的原点共享坐标。 其余两条边不相交，给出大小匹配`2`。 这可以防止在不考虑初始状态的情况下在所有输入边缘上构建匹配的常见错误。 

增广路径案例```
4
1 1
1 2
2 1
3 3
```有一个特别有用的结构。 朴素的贪婪算法可能首先选择`(1,1)`，这会阻止两者`(1,2)`和`(2,1)`。 最大匹配改为选择`(1,2)`和`(2,1)`， 然后`(3,3)`，达到`3`。 Hopcroft-Karp 可以通过改变先前选择的增广路径来发现这一点。 这就是为什么任意贪婪匹配是不够的。 

最后，坐标极限为`10^9`不会在实现中创建特殊情况。 坐标存储为字典键并立即压缩为小整数 ID。 该算法从不分配大小与坐标值成比例的数组，因此诸如`(1000000000, 999999999)`图形存储的成本与矿山完全相同，例如`(1,2)`。
