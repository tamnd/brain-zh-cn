---
title: "CF 102222K - 顶点覆盖"
description: "我们有一个最多有 36 个顶点的无向简单图。 每个顶点都有一个乘法权重。 当每条边在一组顶点中至少有一个端点时，所选的一组顶点是有效的。"
date: "2026-08-17T22:15:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "K"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 193
verified: true
draft: false
---

[CF 102222K - 顶点覆盖](https://codeforces.com/problemset/problem/102222/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多有 36 个顶点的无向简单图。 每个顶点都有一个乘法权重。 当每条边在一组顶点中至少有一个端点时，所选的一组顶点是有效的。 对于每个有效集合 (S)，其值是其所选顶点权重的乘积，空乘积等于 1。任务是将这些乘积添加到每个有效顶点覆盖上，并以给定素数 (q) 为模报告结果。 

输入包含几个独立的图。 对于每个测试用例，(n) 是顶点数，(m) 是边数，(q) 是模数。 下一行包含顶点权重，后面是边。 每个测试用例的答案都打印有其用例编号。 

关键约束是 (n\le 36)。 直接枚举有 (2^{36}=68,719,476,736) 个可能的子集，这已经远远超出了 10 秒程序可以检查的范围。 该图还可以包含 (\Theta(n^2)) 条边，因此检查每个子集的每条边会更糟。 最多 36 个测试用例具有 (n>18) 的保证告诉我们，指数算法是有意的，但其指数部分必须大约依赖​​于 (n) 的一半，而不是 (n) 本身。 

模是素数，但解不需要模除法。 特别是，顶点权重可以恰好为 (q)，因此其权重为零模 (q)。 任何盲目除以顶点权重或使用模逆的方法都需要额外的特殊处理。 下面的解决方案仅使用乘法和加法模 (q)，因此这种情况会自动运行。 

没有边的图是另一个容易犯无声错误的地方。 考虑```
1
3 0 998244353
2 3 5
```每个子集都是一个顶点覆盖，包括空子集。 答案是

 [
 (1+2)(1+3)(1+5)=72。 
]

 开始仅枚举非空覆盖的实现将错过空集中的贡献 1。 

没有边的单个顶点执行相同的边界条件：```
1
1 0 998244353
5
```有两个覆盖，值为 1 的空集和包含值为 5 的顶点的集，所以答案是 6。 

权重等于模数给出了另一种微妙的情况：```
1
1 0 998244353
998244353
```两个封面的值分别为 1 和 (998244353)，分别对 (q) 取模后变为 1 和 0。 正确答案是1。基于模逆的解决方案无法反转这个权重，而中间相遇解决方案则没有这个问题。 

最后，对于由一条边连接的两个顶点，```
1
2 1 998244353
2 3
1 2
```有效覆盖是 ({1})、({2}) 和 ({1,2})，值为 2、3 和 6。答案是 11。这捕获了仅计算最小顶点覆盖的常见错误，因为完整的集合也是顶点覆盖并且对总和有贡献。 

## 方法

 暴力解法直接遵循定义。 枚举（n）个顶点的每个子集（S），测试每条边在（S）中是否至少有一个端点，如果是覆盖，则将其所选顶点的权重相乘并将结果相加。 

这是正确的，因为每个子集都被检查一次，并且测试正是顶点覆盖的定义。 问题是子集的数量。 对于 (n=36)，有 (2^{36}=68,719,476,736) 个。 即使检查子集以某种方式减少到少量机器操作，这也太慢了。 简单的逐边检查可能需要最多 (2^{36}\cdot 630)，这比 (4\times10^{13}) 边缘检查多。 

有用的观察是顶点覆盖恰好是独立集的补集。 然而，我们实际上并不需要将加权表达式转换为独立集表达式。 从代数角度这样做会建议除以顶点权重，当权重为零模 (q) 时，这是不安全的。 相反，我们将顶点分成两部分并保留原始的覆盖权重。 

令左侧包含 (L) 个顶点，右侧包含 (R) 个顶点。 考虑修复左侧选定的顶点。 可以立即检查完全位于左侧的边缘。 每个未选择左端点的交叉边都会强制选择其右端点。 因此，左边的选择决定了一个名为`need`，包含所有必需的正确顶点。 

剩下的是右侧查询：在所有右侧顶点覆盖中，包含其中每个顶点的那些的总权重是多少`need`？ 我们可以通过子集 zeta 变换一次性回答所有此类查询。 最初，数组存储每个精确右侧覆盖的贡献。 改造后，`sum[need]`包含每个右覆盖的总和，该右覆盖是以下的超集`need`。 

暴力破解之所以有效，是因为每个可能的覆盖都可以独立检查，但会失败，因为有 (2^n) 个选择。 固定一半仅对另一半施加子集要求这一观察结果让我们用两个大约 (2^{n/2}) 的枚举替换完整枚举，然后进行子集变换。 

对于实现，我们使用等效的独立集测试来确定半掩码是否是有效的覆盖。 如果`cover`是选择的掩码，那么`full ^ cover`不得包含内部边缘。 可以使用一位递归在 (O(2^k)) 中识别独立掩码。 

当有用时，我们选择稍微不对称的分割。 右侧是子集 zeta 变换运行的一侧，因此应选择其大小以最小化 (R2^R+2^{n-R})。 对于 (n=36)，这给出 (R=16) 和 (L=20)，而不是传统的 18 和 18 分割。 这减少了 Python 中的工作量，同时保持相同的渐近复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n·m)) | (O(n)) | (O(n)) | 太慢了 |
 | 中间相遇 + SOS DP | (O(2^L + R2^R))，(L+R=n) | (O(2^L+2^R)) | 已接受 |

 ## 算法演练

 1. 将顶点分割为左侧尺寸 (L) 和右侧尺寸 (R)。 该实现选择最小化 (R2^R+2^{n-R}) 的分割，因此昂贵的子集变换边保持较小。 
2. 存储三种位掩码。 对于每个左顶点，将其邻居存储在左侧部分中，并将其邻居存储在右侧部分中。 对于每个右侧顶点，将其邻居存储在右侧部分内。 位掩码使所有邻接检查在这些小半部分的规模上保持恒定时间。 
3. 枚举右顶点的每个子集并计算其补集是否为独立集。 如果补集是独立的，则子集本身就是有效的右侧顶点覆盖。 同时，计算所选右侧权重的乘积。 
4、将每一个有效的正右盖的产品放入`sum[mask]`。 无效掩码接收零。 该数组最初描述了精确的覆盖范围，因此`sum[mask]`意味着仅覆盖等于`mask`。 
5.应用超集subset-zeta变换`sum`。 处理完每个右侧位后，`sum[mask]`成为所有有效右侧封面的权重之和，其中包含`mask`。 该变换正是我们所需要的，因为左半部分仅告诉我们哪些右顶点是必需的。 
6. 预计算`need[mask]`对于每个左侧面罩。`need[mask]`是未选择的每个左顶点的右侧邻居的并集`mask`。 必须选择这样的右顶点，否则它们的交叉边在覆盖层中将没有端点。 
7. 枚举每个左侧遮罩。 通过查看掩码的补集并测试该补集是否是独立集来检查其内部有效性。 其选择的顶点乘积是独立计算的。 
8. 对于有效的左掩模，将其权重乘以`sum[need[mask]]`。 后者精确地总结了满足交叉边缘要求的所有右侧覆盖。 将此值添加到答案模 (q) 中。 
9. 打印测试用例的累积答案。 

组合步骤背后的不变量是每个完整的顶点覆盖都恰好有一个左掩模。 一旦固定了左掩模，所有内部左边缘要么被覆盖，要么被丢弃。 每个具有未选定左端点的交叉边都会将其右端点强制压入盖子中，并且`need`准确记录那些强制顶点。 然后，经过 zeta 变换的右数组精确地对包含这些强制顶点的所有有效右掩码求和。 因此，每个完整的封面都贡献一次，并且没有无效的封面贡献。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve_case(n, m, q, weights, edges):
    # Choose R to minimize the dominant subset work:
    # R * 2^R for the SOS transform plus 2^(n-R) for the other half.
    best_r = 0
    best_cost = 1 << (n + 1)

    for r in range(n + 1):
        cost = r * (1 << r) + (1 << (n - r))
        if cost < best_cost:
            best_cost = cost
            best_r = r

    R = best_r
    L = n - R

    adj_l = [0] * L
    adj_r = [0] * R
    cross = [0] * L

    for u, v in edges:
        if u < L and v < L:
            adj_l[u] |= 1 << v
            adj_l[v] |= 1 << u
        elif u >= L and v >= L:
            u -= L
            v -= L
            adj_r[u] |= 1 << v
            adj_r[v] |= 1 << u
        else:
            if u < L:
                cross[u] |= 1 << (v - L)
            else:
                cross[v] |= 1 << (u - L)

    wl = [x % q for x in weights[:L]]
    wr = [x % q for x in weights[L:]]

    # Compute independent-set flags and cover products for the right half.
    nr = 1 << R
    full_r = nr - 1

    ind_r = bytearray(nr)
    ind_r[0] = 1

    prod_r = [0] * nr
    prod_r[0] = 1

    for mask in range(1, nr):
        bit = mask & -mask
        v = bit.bit_length() - 1
        rest = mask ^ bit

        prod_r[mask] = prod_r[rest] * wr[v] % q

        if ind_r[rest] and (adj_r[v] & rest) == 0:
            ind_r[mask] = 1

    # sum[cover] is the exact contribution of this right-side cover.
    # A cover is valid exactly when its complement is independent.
    sum_r = [0] * nr

    for cover in range(nr):
        if ind_r[full_r ^ cover]:
            sum_r[cover] = prod_r[cover]

    # Superset zeta transform.
    for bit_index in range(R):
        bit = 1 << bit_index
        step = bit << 1

        for base in range(0, nr, step):
            end = base + bit
            other = end

            for mask in range(base, end):
                x = sum_r[mask] + sum_r[other]
                if x >= q:
                    x -= q
                sum_r[mask] = x
                other += 1

    # need[mask] = right vertices forced by unselected left vertices.
    nl = 1 << L
    need = array('I', [0]) * nl

    # Compute from supersets. For a mask that is not full, choose a zero bit v.
    # need[mask] = need[mask | bit] | cross[v].
    for mask in range(nl - 2, -1, -1):
        zero_bit = (~mask) & (mask + 1)
        v = zero_bit.bit_length() - 1
        need[mask] = need[mask | zero_bit] | cross[v]

    # Compute independent-set flags and selected-weight products on the left.
    ind_l = bytearray(nl)
    ind_l[0] = 1

    prod_l = [0] * nl
    prod_l[0] = 1

    for mask in range(1, nl):
        bit = mask & -mask
        v = bit.bit_length() - 1
        rest = mask ^ bit

        prod_l[mask] = prod_l[rest] * wl[v] % q

        if ind_l[rest] and (adj_l[v] & rest) == 0:
            ind_l[mask] = 1

    full_l = nl - 1
    ans = 0

    for cover in range(nl):
        if ind_l[full_l ^ cover]:
            ans += prod_l[cover] * sum_r[need[cover]] % q
            if ans >= q:
                ans -= q

    return ans

def solve_data(data):
    tokens = list(map(int, data.split()))
    p = 0
    t = tokens[p]
    p += 1

    out = []

    for case_id in range(1, t + 1):
        n = tokens[p]
        m = tokens[p + 1]
        q = tokens[p + 2]
        p += 3

        weights = tokens[p:p + n]
        p += n

        edges = []
        for _ in range(m):
            u = tokens[p] - 1
            v = tokens[p + 1] - 1
            p += 2
            edges.append((u, v))

        ans = solve_case(n, m, q, weights, edges)
        out.append(f"Case #{case_id}: {ans}")

    return "\n".join(out)

def main():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve_data(data))

if __name__ == "__main__":
    main()
```第一部分`solve_case`选择拆分。 传统的选择是 (L=\lceil n/2\rceil) 和 (R=\lfloor n/2\rfloor)，但 Python 受益于使 SOS 边小一些。 对所有可能 (R) 值的小循环会找到最佳分割，而不会影响算法本身。 

三个邻接数组以两半所需的形式对图进行编码。`adj_l[v]`和`adj_r[v]`是本地邻接掩码。`cross[v]`包含与左顶点 (v) 相邻的右顶点。 这些遮罩之间的区别可防止交叉边缘意外被视为内部边缘。 

独立组阵列是验证封面的最简洁的方法。 对于包含顶点的蒙版`v`，去掉其最低设置位得到`rest`。 较大的掩模恰好在什么时候是独立的`rest`是独立的并且`v`没有邻居`rest`。 由于封面及其补集相当于一个独立的集合，因此测试`ind[full ^ cover]`无需检查每个边缘即可给出封面的有效性。 

使用相同的最低位递归计算乘积数组。 如果`mask = rest | {v}`，那么产品为`mask`是产品`rest`乘以重量`v`。 每次乘法都会对模 (q) 进行约减，因此 Python 永远不会构造出巨大的精确乘积。 

右侧`sum_r`最初包含对精确封面的贡献。 Zeta 变换将其含义从完全相等变为包含。 对于每一位，没有该位的掩码接收具有该位集的相应掩码的贡献。 处理完所有位后，`sum_r[need]`包含每个有效封面，其中包含`need`。 

这`need`array 值得特别注意，因为它依赖于未选择的左顶点，而不是选定的顶点。 对于每个蒙版，选择其中不存在的一个顶点。 如果选择该顶点，我们将拥有更大的蒙版`mask | bit`。 未选择的顶点贡献其整个跨邻居掩模，给出递归

 [
 需要[掩码]=需要[掩码\cup{v}]\mathbin{|}cross[v]。 
]

 循环向后运行，因此已经计算出较大的掩码。 

最后的循环仅接受其补集是独立的左覆盖。 对于每个这样的封面，`prod_l[cover]`是它的精确重量，而`sum_r[need[cover]]`考虑到每个兼容的右盖。 他们的产品正是扩展左侧选择的所有完整封面的总贡献。 

Python 中不存在整数溢出问题。 在具有固定宽度整数的语言中，在取模之前应该以足够宽的类型评估每个乘积。 位掩码也很适合普通整数，因为最多有 36 个顶点。 

## 工作示例

 ### 示例 1

 该图是路径（1-2-3-4），每个权重都是1。通过自然的二二分割，左边的顶点是1和2，右边的顶点是3和4。 

对于右半部分，确切的有效封面是`01`,`10`， 和`11`。 右侧边缘位于顶点 3 和 4 之间，因此空右盖无效。 

| 正确的面具| 确切的贡献 | 超集变换后 |
 | ---| ---| ---|
 |`00`| 0 | 3 |
 |`01`| 1 | 2 |
 |`10`| 1 | 2 |
 |`11`| 1 | 1 |

 左边缘位于顶点 1 和 2 之间。有效的左覆盖为`01`,`10`， 和`11`。 为了`01`，顶点2未被选中，其与顶点3的交叉边强制右位`01`。 对于另外两个左覆盖，没有强制右顶点。 

| 左面罩| 有效封面 |`need`| 左产品 ​​| 正确的总和 | 贡献 |
 | ---| ---| ---| ---| ---| ---|
 |`00`| 没有 |`11`| 1 | 1 | 0 |
 |`01`| 是的 |`01`| 1 | 2 | 2 |
 |`10`| 是的 |`00`| 1 | 3 | 3 |
 |`11`| 是的 |`00`| 1 | 3 | 3 |

 总数为(2+3+3=8)，匹配`Case #1: 8`。 该迹线演示了中心不变量：一旦左盖固定，交叉边就仅成为右侧的强制顶点约束。 

### 示例 2

 该图为 (K_4)，所有权重均等于 1。完整图的顶点覆盖必须包含至少三个顶点。 对于相同的二二分割，右半部分有一条内部边，每个左顶点都连接到两个右顶点。 

右侧变换后的值又是

 | 正确的面具| 确切的贡献 | 超集变换后 |
 | ---| ---| ---|
 |`00`| 0 | 3 |
 |`01`| 1 | 2 |
 |`10`| 1 | 2 |
 |`11`| 1 | 1 |

 有效的左封面是`01`,`10`， 和`11`。 如果恰好选择了一个左顶点，则取消选择另一个左顶点并强制两个右顶点，给出`need = 11`。 如果两个左侧顶点都被选中，`need = 00`。 

| 左面罩| 有效封面 |`need`| 左产品 ​​| 正确的总和 | 贡献 |
 | ---| ---| ---| ---| ---| ---|
 |`00`| 没有 |`11`| 1 | 1 | 0 |
 |`01`| 是的 |`11`| 1 | 1 | 1 |
 |`10`| 是的 |`11`| 1 | 1 | 1 |
 |`11`| 是的 |`00`| 1 | 3 | 3 |

 答案是（1+1+3=5）。 这三个贡献与尺寸为 3 和 4 的四顶点覆盖物完全对应，其中有 4 个尺寸为 3 的覆盖物和 1 个尺寸为 4 的覆盖物。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(2^L + R2^R + m)) | 半掩码 DP 成本 (O(2^L+2^R))、超集变换成本 (O(R2^R)) 以及读取/构建图成本 (O(m))。 |
 | 空间| (O(2^L+2^R+n+m)) | 主要存储由两半的子集数组组成。 |

 这里 (L+R=n)，实现选择 (R) 来最小化实际表达式 (R2^R+2^{n-R})。 对于 (n=36)，选择的分割是 20 和 16，因此最大子集空间约为 (2^{20})，变换涉及约 (16\cdot2^{16}) 个状态。 这比枚举 (2^{36}) 全图子集小得多，并且符合问题的预期指数规模。 

最多只有 36 个测试用例 (n>18) 的保证特别有用，因为这些用例负责大型子集数组。 较小的测试用例具有较小的状态空间。 

## 测试用例

 下面的测试工具假设编辑解决方案保存为`solution.py`， 在哪里`solve_data`是上面定义的函数。```
import io
from solution import solve_data

def run(inp: str) -> str:
    return solve_data(inp).strip()

# Provided samples.
sample = """\
2
4 3 998244353
1 1 1 1
1 2
2 3
3 4
4 6 998244353
1 1 1 1
1 2
1 3
1 4
2 3
2 4
3 4
"""

assert run(sample) == """\
Case #1: 8
Case #2: 5
""", "provided samples"

# Minimum-size graph: one isolated vertex.
assert run("""\
1
1 0 998244353
5
""") == "Case #1: 6", "empty graph and empty cover"

# A weight equal to q becomes zero modulo q.
assert run("""\
1
1 0 998244353
998244353
""") == "Case #1: 1", "weight equal to modulus"

# Smallest graph with an edge, including the full cover.
assert run("""\
1
2 1 998244353
2 3
1 2
""") == "Case #1: 11", "single edge"

# Maximum n, all equal weights, no edges.
# Every subset is a cover, so the answer is 2^36 modulo 998244353.
assert run("""\
1
36 0 998244353
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
""") == "Case #1: 838860732", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 998244353 / 5`|`Case #1: 6`| 最小尺寸、空图、空封面|
 |`1 0 998244353 / 998244353`|`Case #1: 1`| 重量等于模数 |
 |`2 1 998244353 / 2 3 / 1 2`|`Case #1: 11`| 边缘约束和全覆盖的包含|
 |`36 0 998244353 / 36 ones`|`Case #1: 838860732`| 最大顶点数、所有相等权重、指数状态边界 |

 ## 边缘情况

 对于空图，每个子集都是顶点覆盖，因为没有需要覆盖的边。 对于输入```
1
1 0 998244353
5
```裂缝的右侧是空的。 唯一的右侧掩码贡献为 1。左侧两个掩码代表空覆盖和选定的顶点，其乘积为 1 和 5。两个补集是独立的，因为图没有边，因此答案是 (1+5=6)。 

当顶点权重等于模时，其贡献为零模（q），但该顶点仍然是普通图顶点。 为了```
1
1 0 998244353
998244353
```空覆盖贡献 1，所选覆盖贡献 0 模 (q)。 子集乘积是用普通模乘法计算的，因此不需要逆运算。 结果是 1。 

对于单边情况```
1
2 1 998244353
2 3
1 2
```有效的掩码是`01`,`10`， 和`11`。 他们的乘积为 2、3 和 6，得出 11。在中间相遇视图中，无论哪个端点位于左侧，未选择的左端点都会强制选择右端点。 zeta 查询包括强制右覆盖以及任何更大的有效覆盖，因此完整覆盖会被计算在内，而不是被误认为最小覆盖。 

最大尺寸的空图```
1
36 0 998244353
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
```将所有 (2^{36}) 子集作为顶点覆盖，因为没有边。 每个子集都有乘积 1，所以答案是 (2^{36}\bmod998244353=838860732)。 该算法从不构造那些 (2^{36}) 完整子集。 它独立地处理两个半部分，并通过子集变换将它们组合起来，这正是最大情况仍然可行的原因。
