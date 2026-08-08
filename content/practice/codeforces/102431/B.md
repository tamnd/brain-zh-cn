---
title: "CF 102431B - 路径的下确界"
description: "每个有向边都带有一个从 0 到 9 的十进制数字。路径被解释为从左到右的小数分数，但每个新数字都除以另一个因子 10。例如，边权重为 3, 1, 3 的路径的值为 [ frac{3+frac{1+frac{3}{10}}{10}}{10}=0。"
date: "2026-08-08T23:47:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "B"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 552
verified: true
draft: false
---

[CF 102431B - 路径下确界](https://codeforces.com/problemset/problem/102431/B)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个有向边都携带一个从 0 到 9 的十进制数字。路径被解释为从左到右的小数分数，但每个新数字都除以另一个因子 10。例如，具有边权重的路径`3, 1, 3`有价值

 [
 \frac{3+\frac{1+\frac{3}{10}}{10}}{10}=0.313。 
]

 任务是找到从顶点开始的所有路径值的最大下界`0`到顶点`1`。 最小值和下确界之间的区别很重要，因为重复遍历循环可能会产生接近任何有限路径实际达到的极限的值。 答案以模 (10^9+7) 形式打印。 官方问题使用 8 秒时间限制和 256 MB 内存。 

边界足够小，可以对顶点数量进行大致二次运算。 对于 (n\le 2000)，(O(n^2)) 或 (O(nm)) 方法是合理的，特别是因为所有测试用例的顶点总数最多为 20000 个，边总数最多为 40000 个。枚举路径的方法完全不同：循环意味着可以有无限多个路径，甚至将注意力限制在某个固定长度 (L) 的路径上也可以产生指数级的多次游走。 

有几个陷阱会导致直接的最短路径实现不正确。 首先，普通数值边缘权重最小化不是目标。 为了```
2 1
0 1 9
```唯一的路径值为 (0.9)，因此答案为 (9/10)，即`300000003`模 (10^9+7)。 Dijkstra 式的边权重总和将报告 9，这是一个不同的问题。 

其次，不需要达到下确界。 考虑```
3 3
0 2 1
2 2 1
2 1 9
```有限路径的值为 (0.19)、(0.119)、(0.1119) 等。 他们的下确界是

 [
 0.11111\ldots=\frac19,
 ]

 其模值为`111111112`。 仅搜索有限最小路径的解决方案会错过实际答案。 

第三，无法到达顶点 1 的零权重循环不得影响答案。 例如，```
4 4
0 2 3
2 1 4
0 3 0
3 3 0
```有答案（0.34=17/50），即`380000003`模 (10^9+7)。 顶点 3 处的零循环看起来很有吸引力，但它永远无法完成到顶点 1，因此它是无关紧要的。 

最后，具有相同最小数字的多个边可能需要比较它们的后缀。 为了```
4 4
0 2 1
0 3 1
2 1 9
3 1 2
```前两位都是 1，因此必须使用下一位来做出决定。 最优值为 (0.12=3/25)，给出`840000006`模 (10^9+7)。 

## 方法

 强力解决方案会枚举从顶点 0 开始的路径，计算它们的小数值，并保留最小的那个。 这不仅效率低下，而且没有自然的停止点，因为一个有用的循环可能会被任意多次遍历。 在具有分支因子 (b) 的图中，枚举所有长度 (L) 的路径已经需要 (\Theta(b^L)) 工作。 由于边缘多达 4000 条，即使是 (L=2000) 这样的边界也会产生天文数字的候选数。 将搜索限制为简单路径也不能解决问题，因为重复循环的路径可能会接近下确界。 

关键的观察是十进制比较是按字典顺序排列的。 两条路径完全不同的第一个数字决定了哪个值较小。 因此，我们可以将答案视为无限的数字序列。 一旦有限路径到达顶点 1，我们可以想象在顶点 1 永远附加一个零权重自循环。 它的无限数字序列表示完全相同的有限十进制值。 相反，每个可以达到 1 的顶点都可以作为某个有效有限路径的前缀。 因此，原始下确界相当于在顶点 1 处添加零自循环后，找到从顶点 0 可以生成的字典顺序最小的无限数字序列。这是官方解决方案使用的中心变换。 

无法到达顶点1的顶点可以立即丢弃。 在其余的顶点中，只有最小权重的传出边才重要。 如果一个顶点的出边的权重为 2，另一个出边的权重为 5，则从该处开始的最佳无限序列不能使用 5 边，因为第一个数字已经更大。 

仍然可以有几个最小权重边。 在某个位置，我们可能有几个顶点能够产生相同的最小数字，因此我们将它们全部保留为候选集。 在下一个位置，我们再次选择任何候选者中可用的最小数字。 重复此点集过程可构造字典顺序最小的数字序列，而无需枚举路径。 

该序列最终变成周期性的。 相关的有限图只有 (n) 个顶点，因此最佳无限游走在概念上由有限前缀后跟循环组成。 两个可能的前缀加循环结构的长度最多为 (n) 可以在其长度之和内区分，这给出了官方解决方案使用的标准 (3n) 位界限。 我们生成 (3n) 个数字，并搜索从位置 (n) 开始的子串的最小周期。 官方社论准确地描述了这个点集迭代和 (3n) 界限。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 路径长度呈指数 | 路径长度呈指数 | 太慢了|
 | 点集迭代| (O(nm+n^2)) | (O(n+m)) | 已接受 |

 (n^2) 项来自通过测试候选周期长度来查找周期。 由于 (m\le 4000) 和 (n\le 2000)，界限适合给定的限制。 

## 算法演练

1. 构建反向图并从顶点 1 开始进行图搜索。标记每个最终可以达到 1 的顶点。任何接触未标记顶点的边都可以被忽略，因为没有有效的路径可以使用它。 
2. 添加权重为 0 的概念边 (1\to1)。这会将在顶点 1 处停止转换为以零数字永远继续。 它让我们能够完全推理无限序列，而不是对有限路径和通过循环接近下确界的路径有单独的情况。 
3. 对于每个剩余的顶点，找到其最小出边权重，并保留具有该权重的边所到达的所有目的地。 较大的传出权重永远不会成为字典顺序上最小延续的一部分，因为它们在使用它们的第一个数字处丢失。 
4. 从候选集（S={0}）开始。 对于下一个数字，检查 (S) 中的每个顶点并找到其中最小的最小输出权重。 将此数字称为 (d)。 将 (d) 附加到答案字符串。 
5. 将 (S) 替换为来自旧 (S) 中最小权重恰好为 (d) 的顶点的最小权重边的所有目的地。 我们保留每个绑定的目的地，因为两条路径可以共享当前前缀，同时具有不同的未来后缀。 
6. 重复前两个步骤 (3n) 次。 生成的字符串包含足够的信息来识别最佳无限十进制序列的最终周期尾部。 官方解决方案使用这种 (3n) 步构造，并从位置 (n) 开始搜索零件以获取最小周期。 
7. 令(p) 为最多(n) 的最小正整数，使得从位置(n) 到位置(3n-1) 的子串每(p) 个位置重复一次。 即使真正的前缀更早变得周期性，我们也故意使用位置（n）作为周期表示的开始。 将前缀扩展到周期部分不会改变所表示的数字。 
8. 令 (P) 为前 (n) 位数字表示的整数，令 (C) 为接下来 (p) 位数字表示的整数。 无限小数是

 [
 \frac{P}{10^n}
 +
 \frac{C}{10^n(10^p-1)}。 
]

 这个公式就是重复附加(p)位数字块(C)的几何级数。 

1. 计算表达式模 (10^9+7)。 由于模数是质数并且所有所需的分母对于相关长度均非零，因此可以通过费马小定理获得模逆。 

### 为什么它有效

 删除无法达到 1 的顶点后，每个候选前缀都可以补全为到 1 的有效路径。在 1 处附加零自循环意味着有限路径及其无限补零版本具有完全相同的数值。 比较这些十进制值相当于按字典顺序比较它们的数字序列。 

在每个位置，算法都会选择任何当前最佳前缀可以产生的最小数字。 任何以较大数字开头的序列都会立即变差，而以所选数字开头的所有序列仍保留在新的候选集中。 这给出了以下不变量：在 (i) 次迭代之后，生成的 (i) 位数字字符串是所有有效延续中按字典顺序排列的最小可能前缀。 

因为图是有限的，所以最优的无限连续可以由有限前缀后跟循环来表示。 官方的 (3n) 位参数保证可以从生成的字符串中识别周期部分。 一旦知道其周期，几何级数公式就可以准确给出下确界，包括没有有限路径达到它的情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve_case(n, m, edges):
    # Reverse graph for finding vertices that can reach 1.
    rev = [[] for _ in range(n)]
    for u, v, w in edges:
        rev[v].append(u)

    good = [False] * n
    good[1] = True
    stack = [1]

    while stack:
        v = stack.pop()
        for u in rev[v]:
            if not good[u]:
                good[u] = True
                stack.append(u)

    # For every useful vertex, keep only minimum-weight outgoing edges
    # whose destinations are also useful.
    min_w = [10] * n
    nxt = [[] for _ in range(n)]

    for u, v, w in edges:
        if not good[u] or not good[v]:
            continue

        if w < min_w[u]:
            min_w[u] = w
            nxt[u] = [v]
        elif w == min_w[u]:
            nxt[u].append(v)

    # The added 1 -> 1 edge of weight zero.
    if good[1]:
        if min_w[1] > 0:
            min_w[1] = 0
            nxt[1] = [1]
        elif min_w[1] == 0:
            nxt[1].append(1)

    # Point-set iteration.
    # cur contains all vertices that can realize the currently
    # smallest prefix.
    cur = {0}
    digits = []

    for _ in range(3 * n):
        d = 10

        for u in cur:
            if min_w[u] < d:
                d = min_w[u]

        digits.append(d)

        new_cur = set()
        for u in cur:
            if min_w[u] == d:
                new_cur.update(nxt[u])

        cur = new_cur

    # Find the smallest period of digits[n:3*n].
    period = None
    for p in range(1, n + 1):
        ok = True
        for i in range(n, 3 * n - p):
            if digits[i] != digits[i + p]:
                ok = False
                break
        if ok:
            period = p
            break

    # The first n digits are the prefix.
    prefix = 0
    for i in range(n):
        prefix = (prefix * 10 + digits[i]) % MOD

    # The next 'period' digits form the repeating block.
    cycle = 0
    for i in range(n, n + period):
        cycle = (cycle * 10 + digits[i]) % MOD

    inv_10_n = pow(pow(10, n, MOD), MOD - 2, MOD)

    ten_p = pow(10, period, MOD)
    cycle_den = (ten_p - 1) % MOD
    inv_cycle_den = pow(cycle_den, MOD - 2, MOD)

    value = (prefix + cycle * inv_cycle_den) % MOD
    value = value * inv_10_n % MOD

    return value

def solve():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        n, m = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(m)]

        ans = solve_case(n, m, edges)
        out.append(f"Case #{case_id}: {ans}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```反向图仅用于可达性。 从顶点 1 开始，反向图中发现的每个顶点都有一些通往原始图中 1 的有向路径。 这种预处理还消除了永远无法达到目标的误导性零重量循环。 

这`min_w`和`nxt`数组实现了第二次约简。 对于每个有用的顶点，`min_w[u]`是其最小可能的下一个数字，并且`nxt[u]`包含达到该数字的每个目的地。 在读取原始边之后插入顶点 1 处的特殊自循环，以便到达 1 时始终允许连续的零数字。 

点集循环是该算法的核心。`cur`表示紧随已选择的最佳前缀之后出现的每个顶点。 第一次扫描找到这些顶点中最小的下一个数字。 第二次扫描仅保留产生该数字的转换。 一条蟒蛇`set`删除重复的目标，这在输入包含平行边时很有用。 

句点搜索故意从数字开始`n`，而不是试图确定周期的确切开始。 如果真实序列更早变得周期性，则将一些周期性数字作为前缀的一部分是无害的。 该公式保持精确，因为相同的无限周期尾部遵循更长的前缀。 

所有涉及小数本身的算术都是以模 (10^9+7) 进行的。 Python 整数不会溢出，但模数缩减可以使中间值保持较小并使预期的算术变得明确。 

## 工作示例

 ### 示例 1

 该图是```
0 -> 2 (3)
2 -> 3 (4)
2 -> 4 (1)
3 -> 1 (2)
4 -> 1 (3)
```有用的顶点都是五个顶点。 顶点0的最小输出位数为3，顶点2的最小输出位数为1，顶点3的最小输出位数为2，顶点4的最小输出位数为3，顶点1增加了零自环。 

| 职位| 步骤之前设置的候选集 | 选择的数字| 步骤后的候选集 |
 | --- | --- | --- | --- |
 | 1 |`{0}`| 3 |`{2}`|
 | 2 |`{2}`| 1 |`{4}`|
 | 3 |`{4}`| 3 |`{1}`|
 | 4 |`{1}`| 0 |`{1}`|
 | 5 |`{1}`| 0 |`{1}`|

 生成的序列开始于`31300...`，到达顶点 1 后它永远保持为零。 因此实际值为 (0.313)，或者

 [
 \压裂{313}{1000}。 
]

 模 (10^9+7)，这给出`241000002`，匹配样本。 

### 示例 2

 重要的边缘是```
0 -> 1 (9)
0 -> 3 (3)
3 -> 0 (1)
```其他顶点可以达到 1，但不能提供来自重要状态的更好的输出数字。 

| 职位| 步骤之前设置的候选集 | 选择的数字| 步骤后的候选集 |
 | --- | --- | --- | --- |
 | 1 |`{0}`| 3 |`{3}`|
 | 2 |`{3}`| 1 |`{0}`|
 | 3 |`{0}`| 3 |`{3}`|
 | 4 |`{3}`| 1 |`{0}`|
 | 5 |`{0}`| 3 |`{3}`|
 | 6 |`{3}`| 1 |`{0}`|

 最优序列是

 [
 0.31313131\ldots=\frac{31}{99}。 
]

 不存在精确具有该值的有限路径。 相反，遍历循环 (0\to3\to0) 的路径越来越多地从上方接近它。 模值为`40404041`，这是第二个样本输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm+n^2)) | 可达性成本 (O(n+m))、点集迭代检查 (3n) 个位置的保留边以及周期测试成本 (O(n^2))。 |
 | 空间| (O(n+m)) | 图、反向图、有用边列表、候选集和数字序列在输入大小上都是线性的。 |

 对于最大的单个测试用例 (n\le2000) 和 (m\le4000)，因此图形处理仍然保持多项式。 所有测试用例的 (n) 和 (m) 之和也是有界的，这可以防止输入同时包含许多大用例。 官方解决方案给出了相同的点集构造并使用 (3n) 生成的数字。 

## 测试用例```python
import sys
import io

MOD = 10**9 + 7

def solve_case(n, m, edges):
    rev = [[] for _ in range(n)]
    for u, v, w in edges:
        rev[v].append(u)

    good = [False] * n
    good[1] = True
    stack = [1]

    while stack:
        v = stack.pop()
        for u in rev[v]:
            if not good[u]:
                good[u] = True
                stack.append(u)

    min_w = [10] * n
    nxt = [[] for _ in range(n)]

    for u, v, w in edges:
        if not good[u] or not good[v]:
            continue

        if w < min_w[u]:
            min_w[u] = w
            nxt[u] = [v]
        elif w == min_w[u]:
            nxt[u].append(v)

    if min_w[1] > 0:
        min_w[1] = 0
        nxt[1] = [1]
    elif min_w[1] == 0:
        nxt[1].append(1)

    cur = {0}
    digits = []

    for _ in range(3 * n):
        d = min(min_w[u] for u in cur)
        digits.append(d)

        new_cur = set()
        for u in cur:
            if min_w[u] == d:
                new_cur.update(nxt[u])
        cur = new_cur

    period = None
    for p in range(1, n + 1):
        if all(
            digits[i] == digits[i + p]
            for i in range(n, 3 * n - p)
        ):
            period = p
            break

    assert period is not None

    prefix = 0
    for d in digits[:n]:
        prefix = (prefix * 10 + d) % MOD

    cycle = 0
    for d in digits[n:n + period]:
        cycle = (cycle * 10 + d) % MOD

    inv_10_n = pow(pow(10, n, MOD), MOD - 2, MOD)
    inv_cycle_den = pow(
        (pow(10, period, MOD) - 1) % MOD,
        MOD - 2,
        MOD
    )

    return (
        (prefix + cycle * inv_cycle_den) % MOD
    ) * inv_10_n % MOD

def run(inp: str) -> str:
    data = iter(map(int, inp.split()))
    t = next(data)
    out = []

    for case_id in range(1, t + 1):
        n = next(data)
        m = next(data)
        edges = [
            (next(data), next(data), next(data))
            for _ in range(m)
        ]
        ans = solve_case(n, m, edges)
        out.append(f"Case #{case_id}: {ans}")

    return "\n".join(out)

sample = """\
2
5 5
0 2 3
2 3 4
2 4 1
3 1 2
4 1 3
5 6
0 1 9
2 0 6
3 0 1
0 3 3
4 0 3
4 2 7
"""

assert run(sample) == (
    "Case #1: 241000002\n"
    "Case #2: 40404041"
), "provided samples"

assert run("""\
1
2 1
0 1 0
""") == "Case #1: 0", "minimum-size zero path"

assert run("""\
1
2 1
0 1 9
""") == "Case #1: 300000003", "single boundary digit"

assert run("""\
1
3 3
0 2 1
2 2 1
2 1 9
""") == "Case #1: 111111112", "non-attained periodic infimum"

assert run("""\
1
4 4
0 2 1
0 3 1
2 1 9
3 1 2
""") == "Case #1: 840000006", "equal first digits"

max_case = "1\n2000 1\n0 1 9\n"
assert run(max_case) == "Case #1: 300000003", "maximum n"

| Test input | Expected output | What it validates |
|---|---|---|
| `2 1`, edge `0 -> 1` with weight 0 | `Case #1: 0` | Minimum graph size and zero value |
| `2 1`, edge `0 -> 1` with weight 9 | `Case #1: 300000003` | Digit 9 and modular division by 10 |
| `3 3`, `0 -> 2 -> 2`, then `2 -> 1` | `Case #1: 111111112` | Infimum produced by an endlessly repeated cycle |
| `4 4`, two weight-1 choices from 0 | `Case #1: 840000006` | Comparing tied first digits by their suffixes |
| `n=2000`, one edge `0 -> 1` with weight 9 | `Case #1: 300000003` | Maximum vertex count and boundary handling |
```第一个自定义案例确认目标自循环不会意外引入非零贡献。 第二个确认了一位小数的模表示。 第三个抓住了这个问题中最基本的错误，将答案视为有限路径的值而不是下确界。 第四个检查候选集逻辑是否处理共享相同当前数字的多个路径。 最后一种情况使用了允许的最大顶点数，而不引入不必要的图结构。 

## 边缘情况

 对于直接的零权重路径，```
2 1
0 1 0
```候选集开始于`{0}`并选择数字 0。然后它到达顶点 1，其中添加的自循环仅产生零数字。 生成的序列是`000...`，所以答案恰好是 0。 

对于权重为 9 的直边，```
2 1
0 1 9
```第一个数字强制为 9，之后顶点 1 贡献零。 顺序是`9000...`，代表（9/10）。 模计算使用 (10^{-1})，产生`300000003`。 

对于周期性情况，```
3 3
0 2 1
2 2 1
2 1 9
```第一个数字是 1。在顶点 2 处，最小的输出数字再次为 1，因此候选者保留在顶点 2 处。这在生成的序列中无限重复。 最终通过权重 9 边缘方法离开的路径 (0.11111\ldots)，给出 (1/9)。 周期搜索找到一个一位数周期，其中包含`1`。 

对于无法到达的零周期，```
4 4
0 2 3
2 1 4
0 3 0
3 3 0
```从顶点 1 开始的反向搜索标记顶点 1、2 和 0，但不标记顶点 3。在数字处理开始之前，删除顶点 3 处的零循环。 因此，顶点 0 仅具有权重 3 的有用边，然后是来自顶点 2 的权重 4，因此序列开始`34`然后是零。 该值为 (34/100=17/50)，给出`380000003`。 

对于第二个示例，该图创建了循环

 [
 0\xrightarrow{3}3\xrightarrow{1}0。 
]

 候选集序列在之间交替`{0}`和`{3}`，生产`313131...`。 路径可以在任意次数的重复后离开此循环并到达顶点 1，因此有限路径值接近 (31/99)。 该算法不需要显式枚举任何这些路径。 它检测重复的两位数块并直接评估相应的几何级数。
