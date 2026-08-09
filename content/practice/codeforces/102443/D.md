---
title: "CF 102443D - 猜测路径"
description: "我们有一个（m×n）网格。 隐藏的单调路径从 ((1,1)) 开始，到 ((m,n)) 结束，并且仅使用向下和向右移动。 该隐藏路径的每个单元都包含一个检测器。 我们可以发送我们自己的单调路径作为查询。"
date: "2026-08-08T12:51:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "D"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 313
verified: true
draft: false
---

[CF 102443D - 猜测路径](https://codeforces.com/problemset/problem/102443/D)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题陈述

 我们有一个 (m\times n) 网格。 隐藏的单调路径从 ((1,1)) 开始，到 ((m,n)) 结束，并且仅使用向下和向右移动。 该隐藏路径的每个单元都包含一个检测器。 

我们可以发送我们自己的单调路径作为查询。 交互器返回我们的查询路径也访问的每个检测器单元。 因此，查询给出了我们选择的路径和隐藏路径之间的交集。 

我们最多有 10 个查询。 收集足够的信息后，我们必须将精确的隐藏路径输出为字符串`D`和`R`移动。 官方的限制是(1\le m,n\le1000), (m+n>2)，时间限制为一秒，内存为512 MB。 

## 输入

 第一输入行包含 (m) 和 (n)。 之后，程序与交互器进行通信。 对于每个查询，它都会打印`?`后跟有效的路径字符串。 交互器首先返回报告的检测器单元的数量，然后返回它们的坐标，按行排序，然后按列排序。 

## 输出

 当隐藏路径确定后，打印`!`接下来是它的序列`D`和`R`移动。 每个查询和最终答案后面都必须跟有换行符，并且必须刷新交互式输出。 蟒蛇的`print`使用时已经冲洗`flush=True`。 

## 问题理解

 考虑交互器的有用方法是，它为我们提供了精确的交叉点，而不仅仅是“是”或“否”的答案。 如果我们的查询通过隐藏路径的单元格，该单元格就会出现在响应中。 

最初，仅知道 ((1,1)) 和 ((m,n))。 假设隐藏路径上两个连续的已知单元是(A=(r_1,c_1))和(B=(r_2,c_2))。 我们知道它们之间的隐藏路径包含在由这两点定义的矩形中，但我们不知道它的转弯。 

关键是在中间行分割每个这样的未知部分。 让

 [
 r_{\text{mid}}=\left\lfloor\frac{r_1+r_2}{2}\right\rfloor。 
]

 我们构造一个查询，首先向下到达行 (r_{\text{mid}})，然后向右穿过整个矩形，最后向下到达 (B)。 从 (A) 到 (B) 的任何单调隐藏路径必须访问行 (r_{\text{mid}})，并且该行上的单元格位于列 (c_1) 和 (c_2) 之间的某个位置。 我们的水平部分覆盖了每一个单元格，因此两条路径必须在那里相交。 

因此，每个未知部分被分成更小的部分，其行差最多是前一行差的一半。 因为(m\le1000)，减半十次就足够了。 这是解决方案背后的二分搜索结构。 在竞赛解决方案文章中给出了对同一想法的简洁独立描述，它将查询描述为五形路线，并观察到每个查询将剩余范围减半。 

有一个微妙之处。 知道中间行的交点不一定足以简单地通过任意移动连接新点。 最后一个查询本身告诉我们如何解决剩余的单行间隙。 如果两个连续的报告点恰好相差一行，则查询的相应部分恰好包含一次向下移动。 如果我们的查询以该部分开头`D`，隐藏路径必须以所需的正确移动开始，并在最后向下走，除非两条路径重合。 如果查询开头为`R`，强制相反的排列。 这就是必须保留查询路径本身，而不是仅存储返回的坐标的原因。 

例如，考虑从 ((1,1)) 到 ((2,2)) 的 (2\times2) 部分。 如果我们查询`DR`，那么隐藏路径`DR`报告中间单元 ((2,1))。 如果该单元格不存在，则隐藏路径必须是`RD`。 在对该问题的独立解决方案讨论中也强调了这种确切的区别。 

当 (m=1) 时，粗心的实现可能会失败。 在这种情况下，没有行可以进行二分搜索，并且唯一可能的路径是完全水平的。 例如，使用输入```
1 4
```正确的最终路径是`RRR`。 在没有这种特殊情况的情况下尝试执行中点过程可能会构造空或无效的查询。 

另一个边缘情况是 (n=1)。 唯一可能的路径是完全垂直的。 为了```
4 1
```答案是`DDD`。 假设每个部分都包含正确移动的构造可能会错误地生成无效查询。 

当两个连续的已知点对角相邻时，会出现更微妙的边缘情况。 例如，在 ((1,3)) 和 ((2,4)) 之间，隐藏路径是`DR`或者`RD`。 仅仅知道两个端点是不够的。 必须检查查询段本身，因为它的交叉响应区分了两种可能性。 

## 方法

 直接的方法是考虑每一个可能的单调路径。 有

 [
 \binom{m+n-2}{m-1}
 ]

 这样的路径，因为我们选择 (m+n-2) 步中的哪 (m-1) 步是向下步。 暴力求解器可以保留每个候选路径并消除与每个查询响应不一致的候选路径。 检查一个候选者的成本为 (O(m+n))，所以最坏情况的工作是

 [
 \Theta\left((m+n)\binom{m+n-2}{m-1}\right)。 
]

 对于 (m=n=1000)，这大约是 (1998\binom{1998}{999})，大约为 (10^{603}) 个基本路径单元检查。 一秒的限制使这完全不可能。 

暴力破解在概念上是有效的，因为每个响应都会提供足够的信息来拒绝不包含所报告单元的路径。 问题在于，可能的路径数量是指数级的，而交互器只给我们十次提问的机会。 

有用的观察是我们不需要立即区分每条完整路径。 我们可以保持连续的确认单元并同时分割每个不确定的部分。 对于每个部分，五形查询向下到其中间行，向右穿过该部分，然后向下到其端点。 每条隐藏路径都必须穿过该水平中间段。 因此，一个查询同时为每个足够大的部分提供一个新的确认点。 

每个结果部分的行距离最多是旧行距离的一半，直至四舍五入。 由于最大行距仅为（999），因此十次查询就足够了。 最终的单行部分直接根据最后一个查询的形状及其报告的交集来解析。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((m+n)\binom{m+n-2}{m-1})) | 指数| 太慢了 |
 | 最佳 | (O(10(m+n))) | (O(m+n)) | 已接受 |

 ## 算法演练

 1. 读(m)和(n)。 如果 (m=1)，则路径被迫为`R`重复(n-1)次。 如果(n=1)，则被迫`D`重复(m-1)次。 这些情况不需要查询。 
2. 否则，仅用((1,1))和((m,n))初始化确认点。 它们保证属于隐藏路径。 
3. 对于每对连续确认点 (A=(r_1,c_1)) 和 (B=(r_2,c_2))，计算 (r_{\text{mid}}=\lfloor(r_1+r_2)/2\rfloor)。 将查询段构建为`D`重复 (r_{\text{mid}}-r_1) 次，然后`R`重复 (c_2-c_1) 次，然后`D`重复 (r_2-r_{\text{mid}}) 次。 连接这些段给出了从 ((1,1)) 到 ((m,n)) 的完整有效路径。 
4. 发送此路径作为查询并读取所有报告的探测器坐标。 用这些报告的坐标替换当前确认点序列。 它们已经按路径顺序排序，因为两条路径都是单调的，并且交互器先按行报告坐标，然后按列报告坐标。 
5. 检查每对连续报告点之间的行差异。 如果每个这样的差异最多为 1，则停止查询。 否则，用新确认的点重复构建。 
6. 要了解查询数量为何受到限制，请考虑具有行差异 (d) 的旧部分。 查询包含该部分的整个中间行，并且隐藏路径必须满足它。 该行上的新报告点将该部分划分为最多具有行差异的部分 (\lceil d/2\rceil)。 因此，在十次查询之后，最初的最多 (999) 的差异变成了最多 1。 
7. 保留最后一轮的实际查询字符串。 为该查询构建一个坐标到位置图，以便我们准确地知道查询的哪一部分位于每对连续报告的单元格之间。 
8. 如果两个连续的报告单元位于同一行，则它们之间的隐藏路径被迫完全由`R`移动。 
9. 如果它们相差一行，请检查最终查询的相应部分。 如果该查询部分开头为`D`，隐藏路径必须使用相反的顺序，`R`随后移动`D`。 如果查询部分开头为`R`，隐藏路径一定是`D`接下来是所需的`R`移动。 在这一部分中只有一次向下移动，因此这准确地确定了隐藏路径。 
10. 连接所有重建的部分并使用以下命令打印结果路径`!`。 

### 为什么它有效

 不变的是，在每次查询之后，每个报告的坐标都是隐藏路径的真实单元，并且连续报告的坐标划分隐藏路径的仍然未知的部分。 对于每个这样的部分，查询显式遍历其中间行，因此隐藏路径必须与查询相交。 因此，每个新部分最多具有前一行高度的一半。 一旦高度为零或一，剩余路径要么是强制的，要么是通过隐藏路径是否与最终查询的第一次移动一致来唯一确定的。 因此重建不能选择错误的转弯。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    m, n = map(int, input().split())

    if m == 1:
        print("! " + "R" * (n - 1), flush=True)
        return

    if n == 1:
        print("! " + "D" * (m - 1), flush=True)
        return

    points = [(1, 1), (m, n)]
    last_query = None

    for _ in range(10):
        parts = []

        for (r1, c1), (r2, c2) in zip(points, points[1:]):
            mid = (r1 + r2) // 2

            parts.append("D" * (mid - r1))
            parts.append("R" * (c2 - c1))
            parts.append("D" * (r2 - mid))

        query = "".join(parts)
        last_query = query

        print("? " + query, flush=True)

        t = int(input())
        points = [
            tuple(map(int, input().split()))
            for _ in range(t)
        ]

        if all(
            points[i + 1][0] - points[i][0] <= 1
            for i in range(len(points) - 1)
        ):
            break

    # Map every cell of the final query to its position in the query.
    qpos = {}
    r, c = 1, 1
    qpos[(r, c)] = 0

    for i, move in enumerate(last_query, 1):
        if move == "D":
            r += 1
        else:
            c += 1
        qpos[(r, c)] = i

    answer = []

    for a, b in zip(points, points[1:]):
        r1, c1 = a
        r2, c2 = b

        if r1 == r2:
            answer.append("R" * (c2 - c1))
            continue

        # Their row difference is at most one.
        ia = qpos[a]
        ib = qpos[b]

        query_segment = last_query[ia:ib]

        if query_segment[0] == "D":
            # Query uses D followed by R's.
            # The hidden path must use R's followed by D.
            answer.append("R" * (len(query_segment) - 1))
            answer.append("D")
        else:
            # Query uses R's followed by D.
            # The hidden path must use D followed by R's.
            answer.append("D")
            answer.append("R" * (len(query_segment) - 1))

    print("! " + "".join(answer), flush=True)

if __name__ == "__main__":
    main()
```当网格只有一行或一列时，前两种特殊情况可以避免不必要的交互。 无论哪种情况，都只有一条可能的路径。 

主循环将确认的检测器单元存储在`points`。 查询是为每个连续的对独立构建的，然后将所有片段连接起来。 每一块都从一个确认点开始，到下一个确认点结束，因此整个查询是从左上角到右下角的有效路径。 

中点采用整数除法。 这是故意的，因为它保证两个结果行间隔不大于 (\lceil d/2\rceil)。 对于 (d\le999)，十次迭代就足够了。 

来自交互器的响应已经排序，因此不需要额外的排序。 这直接遵循交互协议，该协议保证增加行顺序，并且在一行内增加列顺序。 

决赛`qpos`地图是实现的微妙部分。 我们不能仅从端点重建单行部分。 我们需要知道最终查询是否遍历该部分`D...R`或者`R...D`。 由于查询的每个单元格都有唯一的坐标，`qpos`让我们提取两个报告单元格之间的确切查询段。 

Python 中不存在整数溢出问题。 最大的生成路径只有 (m+n-2\le1998) 次移动，因此所有字符串和坐标集合都很小。 

每次查询和最终答案后都必须刷新交互。 使用`print(..., flush=True)`按照声明的要求直接处理这个问题。 

## 工作示例

 ### 示例 1

 官方示例使用(3\times4)网格，隐藏路径为`RDRDR`。 官方交互使用了不同的有效查询，但我们可以从这篇社论中追踪中点策略。 该声明证实样本中的隐藏路径是`RDRDR`。 

初始确认点是((1,1))和((3,4))。 中点行是 (2)，所以第一个查询是`DRRRD`。 

| 步骤| 确认点| 查询 | 举报点 |
 | ---| ---| ---| ---|
 | 0 | ((1,1),(3,4)) | ((1,1),(3,4)) |`DRRRD`| |
 | 1 | ((1,1),(2,2),(2,3),(3,4)) |`DRRRD`| ((1,1),(2,2),(2,3),(3,4)) |

 对于第一部分，从 ((1,1)) 到 ((2,2))，查询段为`DR`。 由于这些是连续的报告点，因此隐藏路径不能包含内部查询单元 ((2,1))。 因此隐藏路径必须使用相反的顺序，`RD`。 

对于中间部分，两个点都在同一行，因此路径很简单`R`。 

对于最后一节，查询段又是`RD`，所以隐藏路径一定是`DR`。 

连接这三个部分给出`RD`+`R`+`DR`，这正是`RDRDR`。 

此示例演示了为什么需要存储最后一个查询。 仅报告的坐标并不能区分`DR`从`RD`，但他们在查询中的位置确实如此。 

### 示例 2

 考虑一个 (5\times5) 网格，其隐藏路径为`DDDDRRRR`。 

第一个查询使用中间行 (3)：```
DDRRRRDD
```隐藏路径在中间行和端点处与此查询相交，提供足够的点将原始五行部分分割成更小的部分。 

| 步骤| 最大行距| 查询形状 | 结果 |
 | ---| ---| ---| ---|
 | 0 | 4 |`DDRRRRDD`| 发现中排|
 | 1 | 2 | 每个部分的五形查询 | 所有剩余间隙的行间隙最多为 1 |

 在最终重建时，任何同一行间隙都被迫是水平的。 通过将查询的相应部分与内部交集的存在或不存在进行比较来解决单行间隙。 结果路径是`DDDDRRRR`。 

该跟踪演示了行范围的二进制缩减。 行数不需要单独处理。 所有当前不确定的部分都由一个查询同时细化。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((m+n)\log m)) | 最多构建 10 个查询，每个查询包含 (m+n-2) 步，最终查询扫描一次 |
 | 空间| (O(m+n)) | 最多存储 (m+n-1) 个报告单元和 (m+n-2) 个查询移动 |

 从 (m\le1000) 开始，(\lceil\log_2(m-1)\rceil\le10)。 每个查询的长度最多为1998，因此生成的查询数据总量只有两万字符左右。 坐标响应具有相同的顺序。 这很容易满足 512 MB 内存限制，并且对于一秒限制来说足够小。 

## 测试用例

 因为这是一个交互问题，所以官方的示例无法传递给正常的`run()`功能与普通输入相同。 以下线束将隐藏路径视为额外的输入线并模拟交互器。 模拟器应用完全相同的查询结构并返回真实法官将返回的交集单元格。```python
import sys
import io

def hidden_cells(m, n, path):
    r, c = 1, 1
    cells = [(r, c)]

    for ch in path:
        if ch == "D":
            r += 1
        else:
            c += 1
        cells.append((r, c))

    assert (r, c) == (m, n)
    return cells

def solve_offline(m, n, hidden):
    if m == 1:
        return "R" * (n - 1)

    if n == 1:
        return "D" * (m - 1)

    hidden_set = set(hidden)
    points = [(1, 1), (m, n)]
    last_query = None

    for _ in range(10):
        parts = []

        for (r1, c1), (r2, c2) in zip(points, points[1:]):
            mid = (r1 + r2) // 2
            parts.append("D" * (mid - r1))
            parts.append("R" * (c2 - c1))
            parts.append("D" * (r2 - mid))

        query = "".join(parts)
        last_query = query

        r, c = 1, 1
        response = [(r, c)] if (r, c) in hidden_set else []

        for ch in query:
            if ch == "D":
                r += 1
            else:
                c += 1
            if (r, c) in hidden_set:
                response.append((r, c))

        points = response

        if all(
            points[i + 1][0] - points[i][0] <= 1
            for i in range(len(points) - 1)
        ):
            break
    else:
        raise AssertionError("More than 10 queries required")

    qpos = {}
    r, c = 1, 1
    qpos[(r, c)] = 0

    for i, ch in enumerate(last_query, 1):
        if ch == "D":
            r += 1
        else:
            c += 1
        qpos[(r, c)] = i

    answer = []

    for a, b in zip(points, points[1:]):
        r1, c1 = a
        r2, c2 = b

        if r1 == r2:
            answer.append("R" * (c2 - c1))
            continue

        ia = qpos[a]
        ib = qpos[b]
        segment = last_query[ia:ib]

        if segment[0] == "D":
            answer.append("R" * (len(segment) - 1))
            answer.append("D")
        else:
            answer.append("D")
            answer.append("R" * (len(segment) - 1))

    result = "".join(answer)
    assert result == hidden
    return result

def run(inp: str) -> str:
    data = inp.split()
    m = int(data[0])
    n = int(data[1])
    hidden = data[2]

    return solve_offline(
        m,
        n,
        hidden_cells(m, n, hidden)
    )

# Provided sample, represented in simulator form.
assert run("3 4 RDRDR") == "RDRDR", "sample 1"

# Minimum-size grid.
assert run("1 2 R") == "R", "minimum-size horizontal"

# Single-column boundary case.
assert run("5 1 DDDD") == "DDDD", "minimum-width vertical"

# All moves of one direction.
assert run("1 8 RRRRRRR") == "RRRRRRR", "all right moves"

# Maximum-size grid, with all downs first and then all rights.
max_path = "D" * 999 + "R" * 999
assert run(f"1000 1000 {max_path}") == max_path, "maximum-size case"

# Alternating path, designed to exercise many turns.
zigzag = "RDRD" * 499 + "RD"
assert len(zigzag) == 1998
assert run(f"1000 1000 {zigzag}") == zigzag, "many turns"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 4 RDRDR`|`RDRDR`| 提供样本和对角线转弯重建 |
 |`1 2 R`|`R`| 最小尺寸水平网格|
 |`5 1 DDDD`|`DDDD`| 单列边界|
 |`1 8 RRRRRRR`|`RRRRRRR`| 强行全路|
 |`1000 1000 D...DR...R`| 相同的隐藏路径| 最大维度和十个查询绑定 |
 |`1000 1000 RDRD...`| 相同的隐藏路径| 多次转弯和重复的中点重建|

 ## 边缘情况

 当(m=1)时，完全不存在不确定性。 对于准确的输入```
1 4
```机器人必须向右移动 3 次，所以答案是`RRR`。 该实现在进入交互循环之前处理这个问题。 

当（n=1）时，唯一可能的路径是垂直的。 为了```
4 1
```答案是`DDD`。 同样，不需要查询，因为只有一个有效的单调路径。 

对角线两单元的情况是重要的歧义。 假设两个连续的确认点是((1,1))和((2,2))。 两条可能的路径是`DR`和`RD`。 如果查询使用`DR`， 然后`DR`正如隐藏路径报告的那样 ((2,1))。 如果该单元格不存在，则隐藏路径必须是`RD`。 最终的重构代码通过检查相应查询段的第一步来准确捕获此逻辑。 

最后，最大维度为 (1000)，初始行差最多为 (999)。 最坏情况行差异的序列是

 [
 999、\ 500、\ 250、\ 125、\ 63、\ 32、\ 16、\ 8、\ 4、\ 2、\ 1。 
]

 因此，即使在最坏的情况下，十个查询也足够了。 该构造永远不需要依赖于交互器拒绝第十一个查询，这对于交互问题来说是一个有用的防御细节。 官方协议宣称超过十个查询将立即得到错误答案。 

如果你愿意，我还可以将其变成更典型的 Codeforces 编辑风格，包含更短的散文和更正式的正确性证明。
