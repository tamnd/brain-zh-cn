---
title: "CF 102254F - 友谊很重要"
description: "有 (n) 名学生，每个学生都有一个唯一的名字。 最初，每个学生都属于一个单独的团队。 类型 1 操作合并包含两名指定学生的团队。 类型 2 操作询问这两个学生当前是否属于同一团队。"
date: "2026-08-17T21:20:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102254
codeforces_index: "F"
codeforces_contest_name: "IME++ Starters Try-outs 2019"
rating: 0
weight: 102254
solve_time_s: 446
verified: false
draft: false
---

[CF 102254F - 友谊很重要](https://codeforces.com/problemset/problem/102254/F)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 有 (n) 名学生，每个学生都有一个唯一的名字。 最初，每个学生都属于一个单独的团队。 类型 1 操作合并包含两名指定学生的团队。 类型 2 操作询问这两个学生当前是否属于同一团队。 

名称是字符串，因此在处理操作之前，我们需要一种方法将每个名称转换为紧凑的整数标识符。 一旦完成，实际的问题纯粹是在合并下维护连接的组并回答连接查询。 

输入最多包含 (10^5) 个学生和 (10^5) 个运算。 在这个大小下，(O(nq)) 解决方案可以执行多达 (10^{10}) 个基本运算，这远远超出了 1 秒的时间限制所允许的范围。 (O(n^2)) 预处理步骤也是不可能的。 对于每个查询，我们需要有效恒定时间或非常接近恒定时间的操作。 

在某些情况下，粗心的实施可能会产生错误的结果。 学生可以合并到一个先前已与另一个小组合并的小组中。 例如：```
3 3
Ana
Bob
Cat
1 Ana Bob
1 Bob Cat
2 Ana Cat
```正确的输出是：```
yes
```只记住每个学生最近的伙伴的解决方案可能会错误地回答`no`，因为 Ana 从未直接与 Cat 合并。 团队成员身份是可传递的，因此整个连接的组件很重要。 

类型 1 查询还可以涉及已在同一团队中的两名学生：```
2 2
Ana
Bob
1 Ana Bob
1 Ana Bob
```无需进行第二次更改。 如果不处理这种情况，假设根不同的粗心合并实现可能会破坏其数据结构。 

最后，查询可以引用团队规模差异很大的学生：```
4 2
Ana
Bob
Cat
Dan
1 Ana Bob
2 Cat Dan
```答案是`no`，因为 Cat 和 Dan 都没有相互连接。 由于默认父值而意外地将不相关索引视为已连接的解决方案可能会失败。 每个学生都必须从自己组成部分的根开始。 

## 方法

 最直接的方法是显式存储每个团队的成员。 最初，每个团队包含一名学生。 当合并要求我们合并 (x) 和 (y) 团队时，我们可以将一个团队中的每个学生都取出来，并将其团队标识符更改为另一个团队的标识符。 然后，类型 2 查询会比较两个存储的团队标识符。 

这是正确的，因为每次合并后，生成的团队中的每个学生都会收到相同的标识符。 问题在于合并所需的工作量。 在最坏的情况下，一个团队可以包含 (10^5) 个学生，而一长串查询可能会迫使我们反复检查一个大团队。 通过 (10^5) 个查询，简单的实现可以达到 (10^5 \times 10^5 = 10^{10}) 个学生更新。 

暴力方法之所以有效，是因为查询真正需要的唯一信息是两个学生是否具有相同的组件标识符。 失败来自于每次合并后物理维护每个成员的信息。 我们需要一种表示，其中加入两个团队只改变少量存储的信息，无论团队中已有多少学生。 

关键的观察结果是团队形成了不相交的连接组件。 学生不需要认识其团队中的所有其他学生。 它只需要引导我们找到该团队的代表即可。 如果两个学生最终到达同一代表，则他们属于同一部分。 

这正是不相交集并集结构（也称为 DSU 或并集查找）的设置。 每个组件都由一个根表示。 合并连接两个根，而不是重写任一组件的每个成员。 路径压缩使未来的搜索非常短，而按大小或等级并集可防止内部树变得不必要的深度。 

通过这两种优化，每个操作都需要摊销 (O(\alpha(n))) 时间，其中 (\alpha) 是逆阿克曼函数，并且对于所有实际输入大小来说实际上都是常数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) 最坏情况 | (O(n)) | (O(n)) | 太慢了 |
 | 具有路径压缩和按大小联合的 DSU | (O((n+q)\alpha(n))) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 使用从姓名到 ID 的字典，为每个学生分配一个从 (0) 到 (n-1) 的整数 ID。 整数 ID 使 DSU 数组紧凑，并避免在数据结构内重复存储或比较字符串。 
2. 创建一个`parent`数组，其中`parent[i] = i`对于每个学生。 最初，每个学生都是其团队的唯一成员，因此每个学生都是自己的代表。 
3. 创建一个`size`数组初始化为 (1)。 该值记录了有多少学生属于每个根代表的组件。 它将用于决定合并期间哪个根应成为父根。 
4. 对于类型 1 查询，将两个名称都转换为其整数 ID，并使用以下命令查找其根`find`。 如果根相等，则学生已经在同一个团队中，因此该操作不会发生任何变化。 
5. 如果根不同，则比较组件大小并使较小组件的根指向较大组件的根。 将较小的尺寸添加到较大的根尺寸中。 将较小的树连接到较大的树下方可以使 DSU 树变浅。 
6. 对于类型 2 查询，找到两个学生的根。 打印`yes`如果根相等并且`no`否则。 根是他们当前团队的代表，所以根平等正是学生属于同一个团队的条件。 
7. 在`find`，跟随父指针直到到达作为其自己的父顶点的顶点。 返回时，用该根替换每个访问过的学生的父母。 这就是路径压缩，它使得未来涉及这些学生的查询速度更快。 

### 为什么它有效

 不变的是，每个 DSU 组件都代表一个当前团队，并且该团队中的每个学生最终都会达到相同的根。 最初这是真的，因为每个学生都是孤独的。 合并仅连接两个不同的根，因此它将两个相应的团队精确地合并为一个组件，而不连接不相关的团队。 路径压缩仅更改组件的内部表示，而不更改属于该组件的顶点。 因此，当两个学生通过某种类型 1 操作序列加入他们的团队时，他们具有相同的根，因此每个类型 2 答案都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())

    name_to_id = {}
    for i in range(n):
        name = input().strip()
        name_to_id[name] = i

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    out = []

    for _ in range(q):
        t, sx, sy = input().split()
        x = name_to_id[sx]
        y = name_to_id[sy]

        rx = find(x)
        ry = find(y)

        if t == '1':
            if rx == ry:
                continue

            if size[rx] < size[ry]:
                rx, ry = ry, rx

            parent[ry] = rx
            size[rx] += size[ry]

        else:
            out.append("yes" if rx == ry else "no")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```首先构建字典是因为所有后续查询都通过姓名来识别学生。 每个名称都会收到一个稳定的整数 ID，因此 DSU 永远不必直接对字符串进行操作。 

这`parent`数组存储森林结构。 根满足`parent[root] == root`，这给出了`find`精确的停止条件。 迭代实现避免了 Python 递归深度问题，同时`parent[x] = parent[parent[x]]`在搜索过程中执行路径减半。 

对于一个联盟来说，在改变任何事情之前先找到根源。 如果它们已经相等，则忽略该操作。 否则，较小的组件将连接到较大的组件。 仅在父关系更改后，新根的大小才会增加，并且子根中存储的大小不再重要。 

对于查询，除了执行的路径压缩之外，不会有意修改任何结构`find`。 直接比较两个根。 不存在索引边界问题，因为 ID 范围从 (0) 到 (n-1)，并且 Python 整数不存在溢出问题。 

输出累积在一个列表中并在最后写入一次。 通过最多 (10^5) 次查询，可以避免不必要的重复输出调用，并将 I/O 保持在限制范围内。 

## 工作示例

 ### 示例 1

 重要的DSU状态可以用组件集来表示。 下面的根名称从概念上描述了组件，而实现则存储整数根。 

| 查询 | 运营| 运行后的组件 | 输出|
 | ---| ---| ---| ---|
 | 1 |`1 Naum Rebeca`|`{Naum, Rebeca}`,`{Navarro}`,`{Arnon}`,`{Matheus}`,`{Xavier}`| |
 | 2 |`2 Rebeca Naum`| 不变|`yes`|
 | 3 |`1 Matheus Xavier`|`{Matheus, Xavier}`,`{Naum, Rebeca}`,`{Navarro}`,`{Arnon}`| |
 | 4 |`1 Navarro Arnon`|`{Navarro, Arnon}`,`{Matheus, Xavier}`,`{Naum, Rebeca}`| |
 | 5 |`2 Matheus Navarro`| 不变|`no`|
 | 6 |`2 Rebeca Matheus`| 不变|`no`|
 | 7 |`1 Navarro Matheus`|`{Navarro, Arnon, Matheus, Xavier}`,`{Naum, Rebeca}`| |
 | 8 |`2 Xavier Arnon`| 不变|`yes`|
 | 9 |`2 Xavier Rebeca`| 不变|`no`|
 | 10 | 10`1 Rebeca Arnon`|`{Navarro, Arnon, Matheus, Xavier, Naum, Rebeca}`| |
 | 11 | 11`2 Naum Rebeca`| 不变|`yes`|
 | 12 | 12`2 Naum Matheus`| 不变|`yes`|
 | 13 |`2 Naum Xavier`| 不变|`yes`|

 有趣的部分是查询 10。Rebeca 属于包含 Naum 的组件，而 Arnon 属于包含 Navarro、Matheus 和 Xavier 的组件。 工会将这两个根连接在一起，因此所有六个学生现在都有相同的代表。 最后三个查询证明了传递性：Naum 从未直接与 Matheus 或 Xavier 合并，但所有三个查询都成为同一组件的成员。 

### 示例 2

 | 查询 | 运营| 运行后的组件 | 输出|
 | ---| ---| ---| ---|
 | 1 |`1 Sergio Mateus`|`{Sergio, Mateus}`,`{Cesar}`,`{Gustavo}`,`{Caio}`,`{Yu}`| |
 | 2 |`1 Cesar Yu`|`{Cesar, Yu}`,`{Sergio, Mateus}`,`{Gustavo}`,`{Caio}`| |
 | 3 |`1 Cesar Gustavo`|`{Cesar, Yu, Gustavo}`,`{Sergio, Mateus}`,`{Caio}`| |
 | 4 |`2 Cesar Sergio`| 不变|`no`|
 | 5 |`1 Caio Mateus`|`{Caio, Sergio, Mateus}`,`{Cesar, Yu, Gustavo}`| |
 | 6 |`1 Gustavo Yu`| 未更改，组件已相同 | |
 | 7 |`2 Caio Sergio`| 不变|`yes`|
 | 8 |`2 Gustavo Sergio`| 不变|`no`|

 查询 6 是一个有用的边缘情况。 Gustavo 和 Yu 已经通过 Cesar 连接，因此联盟不会创建新组件。 DSU 检测到这一点是因为两个名称产生相同的根。 然后，查询 7 确认将 Caio 连接到 Mateus 还通过现有组件将 Caio 连接到 Sergio。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\alpha(n))) | 构建名称映射需要 (O(n))，并且每个 DSU 操作都有摊销 (O(\alpha(n))) 成本。 |
 | 空间| (O(n)) | (O(n)) | 名称映射、父数组、大小数组和输出存储都随着输入大小线性增长。 |

 对于 (n,q \le 10^5)，DSU 操作实际上是恒定时间。 该解决方案仅执行线性量的预处理和每个查询的极少量操作，因此它完全符合 1 秒和 256 MB 的限制。 对于 Python 的字典和整数数组来说，存储的学生和查询的最大数量也足够小。 

## 测试用例

 下面的测试助手使用相同的`solve`逻辑与提交的程序相同，但接受字符串并捕获其输出，以便可以使用断言检查案例。```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, q = map(int, input().split())

    name_to_id = {}
    for i in range(n):
        name_to_id[input().strip()] = i

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    out = []

    for _ in range(q):
        t, sx, sy = input().split()
        x = name_to_id[sx]
        y = name_to_id[sy]

        rx = find(x)
        ry = find(y)

        if t == '1':
            if rx == ry:
                continue

            if size[rx] < size[ry]:
                rx, ry = ry, rx

            parent[ry] = rx
            size[rx] += size[ry]
        else:
            out.append("yes" if rx == ry else "no")

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample1 = """\
6 13
Navarro
Arnon
Matheus
Xavier
Rebeca
Naum
1 Naum Rebeca
2 Rebeca Naum
1 Matheus Xavier
1 Navarro Arnon
2 Matheus Navarro
2 Rebeca Matheus
1 Navarro Matheus
2 Xavier Arnon
2 Xavier Rebeca
1 Rebeca Arnon
2 Naum Rebeca
2 Naum Matheus
2 Naum Xavier
"""

assert run(sample1) == """\
yes
no
no
yes
no
yes
yes
yes""", "sample 1"

sample2 = """\
6 8
Sergio
Yu
Mateus
Cesar
Gustavo
Caio
1 Sergio Mateus
1 Cesar Yu
1 Cesar Gustavo
2 Cesar Sergio
1 Caio Mateus
1 Gustavo Yu
2 Caio Sergio
2 Gustavo Sergio
"""

assert run(sample2) == """\
no
yes
no""", "sample 2"

minimum_case = """\
2 4
Aa
Bb
2 Aa Bb
1 Aa Bb
2 Aa Bb
1 Aa Bb
"""

assert run(minimum_case) == """\
no
yes""", "minimum size and repeated union"

transitive_case = """\
5 8
Aa
Bb
Cc
Dd
Ee
1 Aa Bb
1 Cc Dd
2 Aa Dd
1 Bb Cc
2 Aa Dd
2 Bb Dd
1 Aa Dd
2 Aa Ee
"""

assert run(transitive_case) == """\
no
yes
yes
no""", "transitive connectivity"

repeated_queries_case = """\
4 7
Aa
Bb
Cc
Dd
2 Aa Bb
2 Cc Dd
1 Aa Bb
2 Aa Bb
1 Aa Bb
1 Cc Dd
2 Cc Dd
"""

assert run(repeated_queries_case) == """\
no
no
yes
yes""", "repeated queries and no-op unions"

n = 100000
names = [f"A{i}" for i in range(n)]
maximum_case = [f"{n} 3"]
maximum_case.extend(names)
maximum_case.append(f"1 {names[0]} {names[-1]}")
maximum_case.append(f"2 {names[0]} {names[-1]}")
maximum_case.append(f"2 {names[1]} {names[-2]}")
maximum_case = "\n".join(maximum_case) + "\n"

assert run(maximum_case) == """\
yes
no""", "maximum size"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`yes`,`no`,`no`,`yes`,`no`,`yes`,`yes`,`yes`| 多重合并、传递连接以及合并两个大型组件 |
 | 样品2 |`no`,`yes`,`no`| 无操作联合和独立组件 |
 | 最小情况 |`no`,`yes`| 最小学生数量和现有组件的重复合并 |
 | 传递案例 |`no`,`yes`,`yes`,`no`| 通过几位中级学生的连接 |
 | 重复查询案例|`no`,`no`,`yes`,`yes`| 并集前后的查询，包括重复的并集 |
 | 最大情况|`yes`,`no`| 数组两端的 (10^5) 个学生和边界 ID |

 ## 边缘情况

 联合链测试解决方案是否理解连接性而不是直接关系。 例如：```
3 3
Ana
Bob
Cat
1 Ana Bob
1 Bob Cat
2 Ana Cat
```第一次结合后，安娜和鲍勃同根同源。 第二次合并后，Bob 的组件与 Cat 的组件连接在一起。 Ana 和 Cat 因此到达相同的根，因此输出为：```
yes
```DSU 处理此问题时没有明确连接每对学生。 

重复的联合不得创建新组件或破坏其大小。 考虑：```
2 4
Aa
Bb
1 Aa Bb
1 Aa Bb
2 Aa Bb
2 Bb Aa
```第一个联合创建一个组件。 第二个并集找到相同的根并立即返回。 然后两个查询比较相同的根并产生：```
yes
yes
```在任何联合之前进行的查询必须区分单独的单例组件。 例如：```
2 1
Aa
Bb
2 Aa Bb
```两个学生最初都是自己的根，因此根不同，输出为：```
no
```这会检查初始化`parent`，因为为每个学生分配一个意外的公共默认根会错误地产生`yes`。 

最大尺寸边界情况使用第一个和最后一个学生 ID：```
4 3
Aaaa
Bbbb
Cccc
Dddd
1 Aaaa Dddd
2 Aaaa Dddd
2 Bbbb Dddd
```第一次操作后，仅`Aaaa`和`Dddd`共享一个组件。 输出是：```
yes
no
```该实现从不假设学生的 ID 与字典映射之外的姓名或位置相关，因此 ID 范围两端的学生将得到相同的处理。 

最后一个微妙的情况是当联合连接两个已经包含许多学生的组件时：```
5 6
Aa
Bb
Cc
Dd
Ee
1 Aa Bb
1 Cc Dd
1 Aa Cc
2 Bb Dd
2 Aa Dd
2 Bb Ee
```第三次联合后，前四名学生属于一个组件。 两个都`Bb Dd`和`Aa Dd`因此产生`yes`， 尽管`Bb Ee`产生`no`。 DSU 通过更改一个根指针而不是单独更新所有四个学生来实现这一目标，这是该方法扩展到 (10^5) 操作的核心原因。
