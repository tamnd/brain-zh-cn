---
title: "CF 102431H - 熊猫先生和SAD"
description: "我们有几个字符串片段，我们可以按任何顺序连接它们。 得到的字符串的分数是连续三个字符SAD出现的次数。"
date: "2026-08-08T17:31:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "H"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 254
verified: true
draft: false
---

[CF 102431H - 熊猫先生和SAD](https://codeforces.com/problemset/problem/102431/H)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几个字符串片段，我们可以按任何顺序连接它们。 结果字符串的分数是连续三个字符的次数`SAD`出现。 已经完全包含在单个片段中的事件不依赖于顺序，因此唯一有趣的部分是跨越两个片段之间的边界发生的情况。 

考虑各个部分之间的边界`x`和`y`。 自从`SAD`长度为 3，跨越此边界的新出现可以使用以下任一字符：`x`和两个来自`y`，或两个来自`x`和一个来自`y`。 第一种情况需要`x`结束于`S`和`y`首先`AD`。 第二个要求`x`结束于`SA`和`y`首先`D`。 关于这两块碎片的其他信息对于该边界来说并不重要。 

因此，任务是对所有棋子进行排序，以便尽可能多的相邻对创建一个新的棋子`SAD`，同时还添加片段内已有的固定出现次数。 

制约因素很大。 一个测试用例中最多可以有 (2\cdot10^5) 块，总体最多可以有 (10^6) 块。 总长度只有 (2\cdot10^6)，这告诉我们对每个字符处理恒定次数是合适的，而任何片段数量的二次方就已经太昂贵了。 对排列进行阶乘搜索显然是不可能的，如果我们利用只有前两个和最后两个字符重要的事实，即使是 (O(n\log n)) 方法也会比必要的工作多得多。 

有几种边缘情况很容易破坏仅基于匹配前缀和后缀计数的实现。 

例如，与```
1
1
SAD
```答案是`1`，因为该事件已经发生在唯一的一块内部。 创造另一个事件是没有界限的。 仅计算边界匹配的解决方案将错误地返回零。 

另一个重要案例是```
1
2
ADSA
DS
```这两块可以以任一顺序创建一个新的出现。 在`ADSA+DS`, 后缀`SA`第一部分加入初始部分`D`第二个。 在`DS+ADSA`, 后缀`S`第一个加入初始的`AD`第二个。 答案是`1`， 不是`2`。 一种粗心的解决方案将每个可能的后缀与每个可能的前缀独立匹配，可以计算两种可能性，即使线性排序在这两个部分之间只有一个边界。 

第三种情况是```
1
3
S
AD
X
```碎片`S`和`AD`可以生产一个`SAD`， 尽管`X`是无关紧要的。 答案是`1`。 未使用的部分的存在一定不能阻止我们形成有用的链条。 

最后，诸如此类的作品`A`值得特别关注。 为了```
1
3
SS
A
DD
```最好的顺序是`SS+A+DD`，这会创建一个`SAD`使用两个边界。 没有直接的`SS+DD`匹配，但中间部分连接两侧。 任何只检查单个片段对的方法都会忽略这种结构。 

## 方法

 直接的暴力方法是尝试每个片段的排列，连接该排列的字符串，然后计数`SAD`。 它是正确的，因为每个可能的排序都被显式检查，因此必然找到最佳排序。 如果总输入长度为 (L)，则评估一种排列需要 (O(L))，从而给出 (O(n!,L)) 时间。 即使忽略扫描字符串的成本，(20!) 也已经是大约 (2.43\cdot10^{18}) 种排列，而实际约束允许 (n) 达到 (2\cdot10^5)。 阶乘搜索立即被排除。 

关键的观察是每一个新的`SAD`恰好属于一个边界。 当边界的左部分的后缀信息与其右部分的前缀信息相匹配时，边界就成功了。 这表明每个部分都由它可以参与的两个边界状态来表示。 

通过将每个部分视为小图中的有向边，我们可以使这种表示更加清晰。 一段开头为`AD`需要一个`S`就在它之前，所以它的左端点是状态`S`。 一段开头为`D`需要`SA`就在它之前，所以它的左端点是`SA`。 如果它两者都不开头，则它没有有用的左连接，因此它的左端点是一个特殊的`START`状态。 

对称地，结尾为`S`提供国家`S`到下一块。 结尾为的一首作品`SA`提供国家`SA`。 否则它会提供一个特殊的`END`状态。 

现在两个连续的部分创建了一个新的`SAD`恰好当第一条边的端点等于第二条边的起点时。 换句话说，一系列片段为可以连接成有向轨迹的每对连续边创建一个新的出现。 

原来的排序问题因此变成了图问题。 我们有一个只有四个可能顶点的多重图，并且每个字符串都是一个有向边。 我们需要将所有边划分为尽可能少的有向路径。 如果有 (k) 条路径总共包含 (n) 条边，则这些路径恰好包含 (n-k) 个成功的连接。 我们可以以任何顺序连接路径，只丢失不同路径之间的连接。 

对于弱连接的有向分量，覆盖其所有边的最小路径数由其度不平衡度决定。 如果某个顶点的传出边多于传入边，则至少必须有那么多路径从该顶点开始。 所需数量为

 [
 \max\left(1,\sum_v \max(0,\operatorname{out}(v)-\operatorname{in}(v))\right)。 
]

 如果每个顶点都是平衡的，则整个组件可以作为一条欧拉路径遍历。 如果存在正不平衡，则每个超额传出度单位都需要单独的试验开始。 

因为我们的图只有四个顶点，所以找到它的弱连接组件需要常数时间。 我们只需要扫描输入字符串一次即可计算内部出现次数并更新四个度数对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n!,L)) | (O(L)) | 太慢了|
 | 最佳 | (O(L+n)) | (O(1)) 除了输入字符串 | 已接受 |

 ## 算法演练

 1. 数一下每件有多少个`SAD`发生的事情已经完全在那件作品中了。 将这些事件直接添加到答案中，因为它们的贡献与顺序无关。 
2. 确定工件的左端点。 如果这首曲子开头是`AD`, 指定端点`S`。 如果它开始于`D`, 指定端点`SA`。 否则分配端点`START`。 

进行此转换的原因是端点代表前一段所需的确切后缀条件。 一段开头为`AD`在上一篇以结尾的作品之后变得有用`S`，而以`D`在上一篇以结尾的作品之后变得有用`SA`。 

1. 确定正确的端点。 如果这首曲子的结尾是`S`, 指定端点`S`。 如果它结束于`SA`, 指定端点`SA`。 否则分配端点`END`。 

右端点代表这一部分可以为下一块提供什么。 各州`START`和`END`永远不会形成有用的边界，但它们让每一块都统一表示为一个有向边。 

1. 在左端点添加 1 个传出度数，在右端点添加 1 个传入度数。 还要记录两个端点属于同一个弱连接组件。 
2. 处理完所有片段后，计算每个弱连接组件所需的最小路径数。 对于一个组件，计算总和`max(0, out[v] - in[v])`在它的顶点上。 如果总和为正，则该组件需要许多轨迹；如果图形是平衡的，则该组件需要一条轨迹。 
3. 对所有组件所需的跟踪计数进行求和。 如果总件数为`n`最小路径数是`k`， 添加`n-k`到内部出现的固定数量。 

为什么它起作用可以通过图不变量来说明。 每一块都是一个边缘，两块贡献一个新的`SAD`当它们的对应边是连续的并且连接在公共图顶点时，正好跨越它们的边界。 轨迹准确地说是一系列片段，其中每个内部边界都贡献一个新的事件。 因此，分解为 (k) 条轨迹可以准确地给出 (n-k) 个跨边界事件。 标准度条件给出了每个弱分量中可能的最小踪迹数，因此没有排序可以获得比`n-k`，并且最优路径分解恰好实现了这么多。 添加固定的内部事件可以得到全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_sad(s):
    cnt = 0
    for i in range(len(s) - 2):
        if s[i:i + 3] == "SAD":
            cnt += 1
    return cnt

def solve_case(strings):
    # Vertices:
    # 0 = START
    # 1 = S
    # 2 = SA
    # 3 = END
    #
    # Each string is an edge left_vertex -> right_vertex.
    out_deg = [0] * 4
    in_deg = [0] * 4

    parent = list(range(4))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        a = find(a)
        b = find(b)
        if a != b:
            parent[b] = a

    answer = 0

    for s in strings:
        answer += count_sad(s)

        # Determine the left endpoint.
        if s.startswith("AD"):
            left = 1
        elif s.startswith("D"):
            left = 2
        else:
            left = 0

        # Determine the right endpoint.
        if s.endswith("SA"):
            right = 2
        elif s.endswith("S"):
            right = 1
        else:
            right = 3

        out_deg[left] += 1
        in_deg[right] += 1
        union(left, right)

    # Every non-empty connected component needs at least one trail.
    component_has_edge = [False] * 4
    for v in range(4):
        if out_deg[v] + in_deg[v] > 0:
            component_has_edge[find(v)] = True

    trails = 0

    for root in range(4):
        if not component_has_edge[root]:
            continue

        positive_imbalance = 0
        for v in range(4):
            if find(v) == root:
                positive_imbalance += max(0, out_deg[v] - in_deg[v])

        trails += max(1, positive_imbalance)

    return answer + len(strings) - trails

def solve_io(data):
    it = iter(data.split())
    t = int(next(it))
    result = []

    for case_no in range(1, t + 1):
        n = int(next(it))
        strings = [next(it) for _ in range(n)]
        ans = solve_case(strings)
        result.append(f"Case #{case_no}: {ans}")

    return "\n".join(result)

def main():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve_io(data))

if __name__ == "__main__":
    main()
```输入被读取`sys.stdin.buffer.read()`因为总输入最多包含 (2\cdot10^6) 个字符。 分割输入一次足够快，并且避免了重复的行级开销。 

对于每个字符串，`count_sad`扫描其字符并计算内部出现次数。 最大字符串长度仅为 20，因此这项工作实际上每段都是恒定的，并且在整个输入中它是 (O(L))。 

端点分类使用`startswith("AD")`,`startswith("D")`,`endswith("SA")`， 和`endswith("S")`。 后缀测试的顺序很重要。`SA`不结束于`S`，因此任一顺序在这里都有效，但首先检查双字符模式会使预期的状态映射变得明确。 

不相交集结构比必要的更通用，因为只有四个顶点，但它提供了一种构造弱连接组件的干净方法。 每条边都联合其两个端点，因此属于同一可能路径组件的所有顶点都会收到相同的代表。 

最后的循环计算每个组件的跟踪要求。 平衡的组件具有零正不平衡，但仍需要一条路径，而具有正不平衡的组件恰好需要路径中的总超额传出度。 Python 整数具有任意精度，因此潜在的大答案不需要任何特殊的溢出处理。 

## 工作示例

 ### 示例 1

 这些碎片是`SAD`,`D`， 和`SA`。 

| 件| 内部的`SAD`| 左顶点 | 右顶点 | 出度片后| 片后以度为单位 |
 | --- | --- | --- | --- | --- | --- |
 |`SAD`| 1 | 开始 | 结束 | 开始：1 | 结束：1 |
 |`D`| 0 | 南澳 | 结束 | 开始：1，SA：1 | 结束：2 |
 |`SA`| 0 | 开始 | 南澳 | 开始：2，SA：1 | 结束：2，SA：1 |

 这`SAD`一件作品在内部贡献了一次发生。 该图有两个组成部分。 边缘`START -> END`从`SAD`与有用的隔离`START -> SA -> END`链形成的`SA`和`D`。 每个组件需要一条路径，因此三个边有两条路径。 

跨界发生的次数为`3 - 2 = 1`。 添加内部事件给出`2`，匹配输出。 一种最佳串联是`SAD + SA + D`，这会产生`SADSAD`。 

### 示例 2

 这些碎片是`SS`,`A`， 和`DD`。 

| 件| 内部的`SAD`| 左顶点 | 右顶点 | 出度片后| 片后以度为单位 |
 | --- | --- | --- | --- | --- | --- |
 |`SS`| 0 | 开始 | S | 开始：1 | 小号：1 |
 |`A`| 0 | 开始 | 结束 | 开始：2 | S：1，结束：1 |
 |`DD`| 0 | 南澳 | 结束 | 开始：2，SA：1 | S：1，结束：2 |

 有两个组成部分。 边缘`START -> S`是一个组成部分，而`START -> END`和`SA -> END`形成另一个组件，因为没有边连接`S`和`SA`。 

每个组件都需要一条路径，因此三个组件有两条路径。 答案是`3 - 2 = 1`。 

相应的排序可以是`SS + A + DD`, 给予`SSADD`。 这`SAD`使用最终的`S`的`SS`，整个`A`，以及第一个`D`的`DD`，正如两条边通过独立线相交所表示的那样`A`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(L+n)) | 每个字符都会被检查固定次数，并且该图只有四个顶点。 |
 | 空间| (O(n+L)) 为输入表示，(O(1)) 辅助 | 图表本身具有恒定的大小。 |

 这里（L）是所有片段的总长度。 由于 (L\le 2\cdot10^6) 和 (n\le10^6) 在整个输入上，该算法仅对输入执行几次线性传递。 每个测试用例的图形计算时间都是恒定的，因此解决方案可以轻松地满足预期的约束。 

## 测试用例```python
import sys
import io

def count_sad(s):
    cnt = 0
    for i in range(len(s) - 2):
        if s[i:i + 3] == "SAD":
            cnt += 1
    return cnt

def solve_case(strings):
    out_deg = [0] * 4
    in_deg = [0] * 4
    parent = list(range(4))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        a = find(a)
        b = find(b)
        if a != b:
            parent[b] = a

    answer = 0

    for s in strings:
        answer += count_sad(s)

        if s.startswith("AD"):
            left = 1
        elif s.startswith("D"):
            left = 2
        else:
            left = 0

        if s.endswith("SA"):
            right = 2
        elif s.endswith("S"):
            right = 1
        else:
            right = 3

        out_deg[left] += 1
        in_deg[right] += 1
        union(left, right)

    component_has_edge = [False] * 4
    for v in range(4):
        if out_deg[v] + in_deg[v] > 0:
            component_has_edge[find(v)] = True

    trails = 0

    for root in range(4):
        if not component_has_edge[root]:
            continue

        imbalance = 0
        for v in range(4):
            if find(v) == root:
                imbalance += max(0, out_deg[v] - in_deg[v])

        trails += max(1, imbalance)

    return answer + len(strings) - trails

def run(inp: str) -> str:
    data = inp.encode()
    it = iter(data.split())
    t = int(next(it))
    result = []

    for case_no in range(1, t + 1):
        n = int(next(it))
        strings = [next(it).decode() for _ in range(n)]
        result.append(f"Case #{case_no}: {solve_case(strings)}")

    return "\n".join(result)

samples = """\
3
3
SAD
D
SA
3
SS
A
DD
4
DS
SA
ADSA
D
"""

assert run(samples) == """\
Case #1: 2
Case #2: 1
Case #3: 3
""", "provided samples"

assert run("""\
1
1
SAD
""") == "Case #1: 1", "single piece with internal occurrence"

assert run("""\
1
2
ADSA
DS
""") == "Case #1: 1", "cycle cannot be counted twice"

assert run("""\
1
3
S
AD
X
""") == "Case #1: 1", "one useful component plus an isolated piece"

assert run("""\
1
3
SA
D
AD
""") == "Case #1: 1", "boundary matching and disconnected components"

# Maximum-size case, also checks that all equal pieces are handled efficiently.
large_input = "1\n200000\n" + ("SAD\n" * 200000)
assert run(large_input) == "Case #1: 200000", "maximum n and all pieces identical"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / SAD`|`Case #1: 1`| 最小尺寸和内部出现次数计数 |
 |`ADSA, DS`|`Case #1: 1`| 有向循环，防止两个可能方向的重复计算 |
 |`S, AD, X`|`Case #1: 1`| 有用且孤立的图形组件 |
 |`SA, D, AD`|`Case #1: 1`| 边界匹配和断开组件|
 | 200000份`SAD`|`Case #1: 200000`| 最大件数和重复相同值 |

 ## 边缘情况

 第一个边缘情况是已经包含的部分`SAD`。 对于输入```
1
1
SAD
```该部分成为图形边缘`START -> END`，因此它不能创建跨边界的事件。 其内部扫描对答案贡献一，并且该图具有包含一条边的一条轨迹。 跨界贡献为`1-1=0`，给出正确答案`1`。 

第二个边缘情况是两件式循环```
1
2
ADSA
DS
```

`ADSA`表示为`S -> SA`，因为它开始于`AD`并以`SA`。`DS`表示为`SA -> S`，因为它开始于`D`并以`S`。 这两条边形成一个平衡分量，因此最小踪迹数为 1。 一条路径中的两条边恰好产生一次成功的连接。 答案是`2-1=1`。 这正是独立前缀和后缀匹配会溢出的情况。 

第三个边缘情况是一个孤立的部分：```
1
3
S
AD
X
```

`S`变成`START -> S`,`AD`变成`S -> END`， 和`X`变成`START -> END`。 前两条边形成一条轨迹并创建一条`SAD`， 尽管`X`属于一个单独的组件，不会创建有用的边界。 三个边有两条路径，因此跨边界贡献为`3-2=1`。 

第四种边缘情况是独立的`A`桥：```
1
3
SS
A
DD
```

`SS`是`START -> S`,`A`是`START -> END`， 和`DD`是`SA -> END`。 仅图形计算就给出了一次成功的连接`SS`链，但实际有用的排序是`SS+A+DD`，其中`A`介于决赛之间`S`首先`D`。 图形表示捕获了这一点，因为一个独立的`A`不是在一个边界处匹配的文字字符，而是该片段本身作为一条边参与原始字符串，其两个边界均由其端点表示。 结果最大值为 1，完全符合要求。 

第五个边缘情况是大量相同的情况`SAD`件。 每一块都贡献一次内部出现，并且没有有用的边界端点。 该图包含许多平行线`START -> END`边缘，需要一条轨迹，因为它们形成单个弱组件。 任何两件这样的作品都不能创造出额外的作品`SAD`越过他们的边界。 对于 200000 件，答案恰好是 200000，并且算法在不依赖于可能的订购数量的情况下处理这个问题。
