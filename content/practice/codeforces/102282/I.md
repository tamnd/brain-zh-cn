---
title: "CF 102282I - \u041f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u044f"
description: "我们有一个（n×n）网格。 一些单元格包含正整数，其余单元格包含零。 每行和每列必须恰好包含两个非零单元格。"
date: "2026-08-13T09:15:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102282
codeforces_index: "I"
codeforces_contest_name: "2011, \u041e\u0442\u0431\u043e\u0440\u043e\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0435\u0441\u0442 \u0421\u0413\u0410\u0423 \u043d\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b ACM ICPC"
rating: 0
weight: 102282
solve_time_s: 204
verified: true
draft: false
---

[CF 102282I - \u041f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u044f](https://codeforces.com/problemset/problem/102282/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (n \times n) 网格。 一些单元格包含正整数，其余单元格包含零。 每行和每列必须恰好包含两个非零单元格。 (i) 行中两个数字的乘积必须等于 (y_i)，而 (j) 列中两个数字的乘积必须等于 (x_j)。 写入网格的每个数字必须与其他写入的数字不同。 

输入由 (n) 个、所需的 (n) 个列积 (x_0,\ldots,x_{n-1}) 和 (n) 个所需的行积 (y_0,\ldots,y_{n-1}) 组成。 该语句保证至少存在一个有效的网格，因此我们只需构造一个。 

查看网格的一种有用方法是作为二分图。 为每一行创建一个顶点，为每一列创建一个顶点。 非零单元格成为其行和列之间的边缘，单元格中的数字成为边缘标签。 由于每一行和每一列都恰好包含两个数字，因此每个顶点的度数都是二。 因此，选定的单元格形成偶数循环的集合。 规定了与每行或每列相关的标签的乘积。 

界限 (n \le 10) 是有关预期方法的主要信号。 只有 (2n \le 20) 个数字可供放置，但它们的位置和值通过行和列相互作用。 对任意单元的强力太大，而对强制乘法结构的仔细修剪的回溯搜索足够小。 

产品最多为 (1000)。 这特别有用，因为表中放置的每个数字都会除包含该数字的行的乘积，还会除以该数字所在列的乘积。 因此，所有候选值都位于从 (1) 到 (1000) 的数字的约数中，并且目标很少有可能分解为两个不同的正整数。 

粗心的实施可能会错过一些边缘情况。 数字 (1) 允许作为单元格值，并且它可能是必需的。 例如，```
2
2 12
3 8
```有有效的输出```
1 3
2 4
```第一行使用 (1) 和 (3)，因此将 (1) 作为无用因素拒绝会错误地消除解。 

行积也可以是正方形，但其两个单元格值不相等。 例如，```
2
20 63
36 35
```可以通过以下方式解决```
4 9
5 7
```第一行有乘积 (4 \cdot 9 = 36)。 即使禁止使用相等的值，仅考虑平方 (36) 的对 ((6,6)) 的求解器也会失败。 

这两个因素的顺序很重要，因为它们必须进入不同的列。 例如，```
2
10 21
6 35
```有解决方案```
2 3
5 7
```因子(2)和(3)都属于行积(6)，但只有(2)适合第一列积(10)，而(3)适合第二列积(21)。 将无序因子对视为其方向无关紧要会丢失有效的位置。 

## 方法

 最直接的强力方法是在每行中选择两个单元格，然后选择两个值，其乘积是所需的行乘积。 对于 (n=10)，即使只选择已经给出的位置

 [
 \binom{100}{2}^{10}=4950^{10}
 ]

 在考虑值、列约束或所有值都不同的要求之前可能的选择。 这大约是 (8.7\cdot10^{36}) 种可能性，因此逐个单元的枚举是完全不切实际的。 

有用的观察结果是行积不允许任意值。 如果一行的余积为(p)，则其两个值必须是因子对(a,b)，其中(ab=p)。 从 (p\le1000) 开始，这样的对就很少了。 同样的观察也适用于列。 

我们可以更进一步，用剩余乘积和剩余度来表示每一行和每一列。 最初，每个顶点都有二度，其剩余的乘积是其原始目标。 每当我们在一条边上放置一个值 (v) 时，我们都会将两个端点的剩余乘积除以 (v)，并将两个端点度数减一。 

搜索始终选择当前最受约束的行或列。 如果一个顶点只有一条剩余边，则其下一个值完全由其剩余乘积决定。 我们只需要决定哪个相反的顶点接收它。 如果一个顶点有两条剩余边，我们枚举它的因子对和两个可能的相反顶点。 

这比在单元格上搜索要小得多。 更重要的是，一旦我们选择一个二度顶点并将其连接到两个邻居，这些邻居就会变成一度。 然后，搜索通过结果循环传播强制值。 如果解决方案由多个循环组成，则对另一个组件重复相同的过程。 

对于不超过 (1000) 的乘积，最多有 32 个除数，因此最多有 16 个无序因子对。 一个二度顶点最多有 (n(n-1)) 个两个不同邻居的有序选择，在可分性和唯一性剪枝之前最多给出 (16\cdot10\cdot9=1440) 个局部候选。 在实践中，候选者数量要少得多，因为每个候选者还必须除以其两个选定邻居的剩余乘积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O\left(\binom{n^2}{2}^n\right)) 在选择值之前 | (O(n^2)) | 太慢了 |
 | 约束回溯 | (O(B^{2n})) 最坏情况，(B\le1440)，具有强整除剪枝 | (O(n^2)) 除了搜索堆栈和记忆之外 | 已接受 |

 最坏情况的指数界限是故意宽松的。 实际搜索由 (n\le10)、最大 (1000) 的小除数计数、二阶结构以及一旦一个端点无法完成而拒绝所有失败的部分分配这一事实来控制。 

## 算法演练

1.将(n)行和(n)列视为(2n)个顶点。 对于每个顶点，存储其剩余乘积及其剩余度数。 最初每个度数都是二，剩下的乘积就是相应的输入值。 
2. 维护已使用的单元格值集。 仅当某个值未出现在网格中的其他位置时才可以放置该值。 还要维护哪些行列单元格已经被占用，因为图形必须很简单，并且相同的单元格不能被选择两次。 
3.对于剩余度数为1的顶点，强制其下一个边值。 它必须等于顶点的剩余乘积。 我们枚举相反的顶点，其中该值除以相反的剩余乘积，并且连接单元尚未使用。 
4. 对于剩余度数为 2 的顶点，将其剩余乘积的每个因式分解 (a\cdot b=p) 枚举为两个不同的值。 对于每个因子对，选择两个不同的可用相反顶点。 考虑两个方向（a）在第一个顶点和（b）在第二个顶点，以及相反的方向，因为相反的产品可能只接受一个方向。 
5. 在接受候选人之前，检查两个端点的直接后果。 如果端点的度数变为 0，则其剩余乘积必须变为 1。 如果它变成了一级，它的剩余产品一定是仍然可以使用的价值。 如果它仍然是二阶，则其剩余乘积仍必须分解为两个不同的未使用值。 这些检查在递归之前丢弃不可能的分支。 
6. 在仍然具有关联边的所有顶点中，选择当前可行候选点最少的顶点。 这是标准的最小剩余值想法。 强制一阶顶点特别有价值，因为它的值是已知的，因此它通常只有几个可能的邻居。 
7. 通过将其值写入相应的单元格，除以剩余的乘积，减少度数，并将值和单元格标记为已使用，来应用所选的候选值。 
8. 递归直到每个顶点的度数为零。 此时，每一行和每一列都恰好有两个值，所有剩余的产品都是一个，并且所有单元格值都是不同的。 构建的网格就是答案。 

### 为什么它有效

 不变的是，每个部分分配代表一组已选择的有效边，并且对于每个顶点，其存储的剩余乘积正是其未分配的关联边仍需要的乘积。 仅当候选值除以两个端点乘积、考虑剩余度数、使用空单元格并且全局未使用时，才考虑候选值。 因此，每个递归状态仍然可以对应于有效的完成。 相反，对于状态的任何有效完成，下一个选择的顶点必须在其度数为 1 时使用其强制剩余值，或者在其度数为 2 时使用其有效因子对之一，并连接到其两个实际邻居。 搜索枚举了所有此类可能性，因此它不能丢弃唯一有效的解决方案。 由于输入保证存在解，因此某些分支会达到所有度数均为零的状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXV = 1000

factor_pairs = [[] for _ in range(MAXV + 1)]
for p in range(1, MAXV + 1):
    d = 1
    while d * d <= p:
        if p % d == 0:
            e = p // d
            if d != e:
                factor_pairs[p].append((d, e))
        d += 1

def solve(data: str) -> str:
    it = iter(data.split())
    n = int(next(it))
    x = [int(next(it)) for _ in range(n)]
    y = [int(next(it)) for _ in range(n)]

    if prod(x) != prod(y):
        return ""

    m = 2 * n

    rem = x[:] + y[:]
    deg = [2] * m

    ans = [[0] * n for _ in range(n)]
    used_mask = 0
    edge_mask = 0

    def edge_bit(v, u):
        if v < n:
            r, c = v, u - n
        else:
            r, c = u, v - n
        return 1 << (r * n + c)

    def neighbors(v):
        if v < n:
            return range(n, 2 * n)
        return range(n)

    def cell_coords(v, u):
        if v < n:
            return v, u - n
        return u, v - n

    def value_unused(v, mask):
        return (mask >> v) & 1 == 0

    def future_possible(u, value, mask, emask):
        if deg[u] <= 0:
            return False

        if rem[u] % value != 0:
            return False

        nr = rem[u] // value
        nd = deg[u] - 1

        if nd == 0:
            return nr == 1

        if value_unused(value, mask):
            pass

        if nd == 1:
            if nr <= 0 or nr > MAXV:
                return False
            if not value_unused(nr, mask):
                return False

            for w in neighbors(u):
                if deg[w] == 0:
                    continue
                bit = edge_bit(u, w)
                if emask & bit:
                    continue
                if rem[w] % nr == 0:
                    return True
            return False

        if nr <= 0 or nr > MAXV:
            return False

        for a, b in factor_pairs[nr]:
            if not value_unused(a, mask) or not value_unused(b, mask):
                continue
            for w1 in neighbors(u):
                if deg[w1] == 0:
                    continue
                bit1 = edge_bit(u, w1)
                if emask & bit1:
                    continue
                if rem[w1] % a != 0:
                    continue
                for w2 in neighbors(u):
                    if w2 == w1 or deg[w2] == 0:
                        continue
                    bit2 = edge_bit(u, w2)
                    if emask & bit2:
                        continue
                    if rem[w2] % b == 0:
                        return True
        return False

    def candidates(v, mask, emask):
        result = []

        if deg[v] == 0:
            return result

        if deg[v] == 1:
            value = rem[v]

            if value <= 0 or value > MAXV:
                return result
            if not value_unused(value, mask):
                return result

            for u in neighbors(v):
                if deg[u] == 0:
                    continue

                bit = edge_bit(v, u)
                if emask & bit:
                    continue

                if rem[u] % value != 0:
                    continue

                new_mask = mask | (1 << value)
                if not future_possible(u, value, new_mask, emask | bit):
                    continue

                result.append((u, value))
            return result

        for a, b in factor_pairs[rem[v]]:
            if not value_unused(a, mask) or not value_unused(b, mask):
                continue

            for u in neighbors(v):
                if deg[u] == 0:
                    continue
                bit_u = edge_bit(v, u)
                if emask & bit_u:
                    continue
                if rem[u] % a != 0:
                    continue

                for w in neighbors(v):
                    if w == u or deg[w] == 0:
                        continue
                    bit_w = edge_bit(v, w)
                    if emask & bit_w:
                        continue
                    if rem[w] % b != 0:
                        continue

                    new_mask = mask | (1 << a) | (1 << b)
                    new_emask = emask | bit_u | bit_w

                    if not future_possible(u, a, new_mask, new_emask):
                        continue
                    if not future_possible(w, b, new_mask, new_emask):
                        continue

                    result.append((u, a, w, b))

        return result

    failed = set()

    def dfs(mask, emask):
        if all(d == 0 for d in deg):
            return True

        key = (
            tuple(rem),
            tuple(deg),
            mask,
            emask,
        )
        if key in failed:
            return False

        best_v = -1
        best_candidates = None

        for v in range(m):
            if deg[v] == 0:
                continue

            cand = candidates(v, mask, emask)

            if not cand:
                failed.add(key)
                return False

            if best_candidates is None or len(cand) < len(best_candidates):
                best_v = v
                best_candidates = cand

                if len(best_candidates) == 1:
                    break

        v = best_v

        for cand in best_candidates:
            if deg[v] == 1:
                u, value = cand

                r, c = cell_coords(v, u)
                ans[r][c] = value

                old_rem_v = rem[v]
                old_rem_u = rem[u]
                old_deg_v = deg[v]
                old_deg_u = deg[u]

                rem[v] //= value
                rem[u] //= value
                deg[v] -= 1
                deg[u] -= 1

                bit = edge_bit(v, u)
                if dfs(mask | (1 << value), emask | bit):
                    return True

                rem[v] = old_rem_v
                rem[u] = old_rem_u
                deg[v] = old_deg_v
                deg[u] = old_deg_u
                ans[r][c] = 0

            else:
                u, a, w, b = cand

                r1, c1 = cell_coords(v, u)
                r2, c2 = cell_coords(v, w)

                ans[r1][c1] = a
                ans[r2][c2] = b

                old = (
                    rem[v], rem[u], rem[w],
                    deg[v], deg[u], deg[w]
                )

                rem[v] //= a
                rem[u] //= a
                deg[v] -= 1
                deg[u] -= 1

                rem[v] //= b
                rem[w] //= b
                deg[v] -= 1
                deg[w] -= 1

                bit1 = edge_bit(v, u)
                bit2 = edge_bit(v, w)

                if dfs(
                    mask | (1 << a) | (1 << b),
                    emask | bit1 | bit2
                ):
                    return True

                rem[v], rem[u], rem[w] = old[:3]
                deg[v], deg[u], deg[w] = old[3:]
                ans[r1][c1] = 0
                ans[r2][c2] = 0

        failed.add(key)
        return False

    dfs(used_mask, edge_mask)

    return "\n".join(" ".join(map(str, row)) for row in ans)

def prod(a):
    result = 1
    for v in a:
        result *= v
    return result

if __name__ == "__main__":
    data = sys.stdin.read()
    sys.stdout.write(solve(data))
```因子对表预先计算一次。 对于 (1000) 以内的每个乘积，它仅存储成对的不同因子，因为两次使用相同的值会违反全局唯一性条件。 

数组`rem`和`deg`包含二分图的两边。 顶点`0`通过`n-1`代表行，而顶点`n`通过`2*n-1`代表列。 划分`rem`并递减`deg`放置一条边后直接反映了算法的数学不变量。 

这`edge_mask`除了学位信息之外，还需要提供信息。 两个顶点可能仍然具有未使用的度数，而它们的连接单元已被先前的决策占用。 如果不记住占用的单元格，搜索可能会意外地在同一行和列之间创建平行边。 

这`used_mask`将所有使用的值存储为位。 由于每个值最多为 (1000)，因此 Python 整数是一种有效的表示形式。 测试一个值是否已经出现变成了一位操作。`future_possible`执行本地前向检查。 它并没有证明剩下的实例是可解决的，但它检测到了几个直接不可能的情况。 特别是，度数变为 0 的顶点必须具有剩余乘积 1，而度数变为 1 的顶点必须具有实际上可以在某处连接的剩余值。 

递归搜索使用最小剩余值。 它为每个未完成的顶点生成候选点，并选择候选列表最小的顶点。 一阶顶点通常几乎是强制的，因此在第一个二阶决策之后，搜索通常会在整个循环中传播，而分支很少。 

记忆键包含剩余产品、剩余度数、使用值和占用的单元格。 所有这些都是必需的，因为具有相同产品的两个状态在哪些单元已经被占用或者哪些值已经被消耗方面仍然可能不同。 

Python 整数不会溢出，因此乘积和位掩码是安全的。 输入只有一个测试用例，与语句所指定的完全相同，因此不存在测试用例循环。 

## 工作示例

 ### 示例 1

 输入是```
2
2 12
3 8
```第一行必须包含 (3) 的两个不同因子，因此唯一的可能性是 (1) 和 (3)。 第一列有目标 (2)，因此 (1) 必须到达那里。 第二列接收 (3)。 剩下的行有目标 (8)，其唯一可能的位置是 (2) 位于第一列，(4) 位于第二列。 

| 步骤| 选定的顶点 | 作业 | 剩余产品 |
 | --- | --- | --- | --- |
 | 0 | 第 0 行 | 无 | 行数：3、8； 列：2、12 |
 | 1 | 第 0 行 | (r_0c_0=1,\r_0c_1=3) | 行数：1、8； 列：2、4 |
 | 2 | 第 0 列 | (r_1c_0=2) | 行数：1、4； 列：1、4 |
 | 3 | 第 1 栏 | (r_1c_1=4) | 行：1、1； 列： 1, 1 |

 最终的网格是```
1 3
2 4
```每行和每列恰好有两个条目，并且四个值是不同的。 该表还说明了为什么一阶顶点很强大：第一行固定后，每一列恰好有一个剩余边，因此它的值是强制的。 

### 示例 2

 输入是```
3
5 8 18
2 30 12
```最受约束的初始顶点是零列。 它的目标是（5），它的两个因素必须是（1）和（5）。 唯一兼容的行积是 (1) 的第 0 行和 (5) 的第 1 行。 

| 步骤| 选定的顶点 | 作业 | 剩余产品 |
 | --- | --- | --- | --- |
 | 0 | 第 0 列 | 无 | 行数：2、30、12； 列：5、8、18 |
 | 1 | 第 0 列 | (r_0c_0=1,\r_1c_0=5) | 行数：2、6、12； 列：1、8、18 |
 | 2 | 第 1 行 | (r_1c_2=6) | 行数：2、1、12； 列：1、8、3 |
 | 3 | 第 2 栏 | (r_2c_2=3) | 行数：2、1、4； 列：1、8、1 |
 | 4 | 第 0 行 | (r_0c_1=2) | 行：1、1、4； 列：1、6、1 |
 | 5 | 第 2 行 | (r_2c_1=4) | 行：1,1,1； 列： 1, 1, 1 |

 得到的网格是```
1 2 0
5 0 6
0 4 3
```该迹线展示了循环传播。 一旦第 0 列被固定，第一行就只有一个剩余因子，该因子固定第二列，然后固定第二行在该列中的因子。 最后两个位置变成了被迫的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(B^{2n})) 在松散的最坏情况下，(B\le1440) | 每个递归决策至少分配一条边，每个二阶决策仅考虑因子对和相反顶点对 |
 | 空间| (O(n^2 + S)) | 网格、掩码、递归状态和记忆的失败状态需要与搜索成比例的存储 |

 理论上的指数界限是有意保守的。 对于 (n\le10)，完整解中只有 20 个顶点和 20 个占用的单元。 除数限制使每个局部因子选择很小，而最小候选启发式和前向检查立即消除大多数分支。 这种结构使搜索在给定的 (1) 第二限制下变得可行。 

## 测试用例

 下面的测试工具假设`solve`解决方案中的函数可在同一文件中使用或从该文件导入。 由于问题允许任何有效答案，因此会准确检查样本，同时使用验证器检查自定义案例，以验证问题的每个要求。```python
import io
import sys

def run(inp: str) -> str:
    return solve(inp).strip()

def validate(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    n = data[0]
    x = data[1:1 + n]
    y = data[1 + n:1 + 2 * n]

    lines = out.strip().splitlines()
    if len(lines) != n:
        return False

    a = []
    for line in lines:
        row = list(map(int, line.split()))
        if len(row) != n:
            return False
        a.append(row)

    used = set()

    for i in range(n):
        values = [a[i][j] for j in range(n) if a[i][j] != 0]
        if len(values) != 2:
            return False
        if values[0] in used or values[1] in used:
            return False
        if values[0] <= 0 or values[1] <= 0:
            return False
        if values[0] * values[1] != y[i]:
            return False
        used.update(values)

    for j in range(n):
        values = [a[i][j] for i in range(n) if a[i][j] != 0]
        if len(values) != 2:
            return False
        if values[0] * values[1] != x[j]:
            return False

    return True

sample1 = """\
2
2 12
3 8
"""

sample2 = """\
3
5 8 18
2 30 12
"""

assert run(sample1) == "1 3\n2 4", "sample 1"
assert run(sample2) == "1 2 0\n5 0 6\n0 4 3", "sample 2"

case_min = """\
2
10 21
6 35
"""
assert validate(case_min, run(case_min)), "minimum size and forced orientation"

case_boundary = """\
2
600 500
1000 300
"""
assert validate(case_boundary, run(case_boundary)), "product 1000 boundary"

case_equal_rows = """\
4
15 120 90 80
60 60 60 60
"""
assert validate(case_equal_rows, run(case_equal_rows)), "equal row products"

case_max = """\
10
11 40 57 72 85 96 105 112 117 120
20 38 54 68 80 90 98 104 108 110
"""
assert validate(case_max, run(case_max)), "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 10 21 / 6 35`| 任何有效的 (2\times2) 网格 | 最小尺寸和因素取向|
 |`2 / 600 500 / 1000 300`| 任何有效的 (2\times2) 网格 | 边界积 (1000)，加上大因子 |
 |`4 / 15 120 90 80 / 60 60 60 60`| 任何有效的 (4\times4) 网格 | 许多相同的目标产品|
 |`10 / 11 40 57 72 85 96 105 112 117 120 / 20 38 54 68 80 90 98 104 108 110`| 任何有效的 (10\times10) 网格 | 最大值 (n) 和完整回溯搜索 |

 最大尺寸情况来自使用不同值 (1) 到 (20) 的十个周期。 它的行对是 ((1,20),(2,19),\ldots,(10,11))，列乘积是从循环周围的相邻值中选择的。 每个所需的产品都保持在 (1000) 以下，而所有 20 个单元格值保持不同。 

## 边缘情况

 值 (1) 的处理方式与其他正整数完全相同。 在第一个样本中，第 0 行的乘积为 (3)，因此因子对为 (1,3)。 列产品 (2) 和 (12) 将 (1) 推入第一列，将 (3) 推入第二列。 求解器从不将 (1) 视为特殊的，其位记录在`used_mask`，因此稍后不能引入第二个 (1)。 

对于诸如 (36) 之类的平方积，因子对生成器枚举直到 (\sqrt{36}) 的每个除数 (d)，然后存储不同的对 ((d,36/d))。 因此，即使 (36) 是正方形，也考虑 ((4,9))。 故意排除 ((6,6)) 对，因为两个像元值必须不同。 

对于方向敏感的情况```
2
10 21
6 35
```第 0 行具有因子 (2) 和 (3)。 第一列接受 (2)，第二列接受 (3)。 放置它们后，剩余的行有产品 (35)，并且 (5) 和 (7) 被强制放入剩余的单元格中。 反向方向会留下一个包含不兼容剩余产品的列，因此前向检查会立即或在下一个递归步骤中拒绝它。 

产品边界情况```
2
600 500
1000 300
```有一个有效的网格```
20 50
30 10
```因为行积是 (20\cdot50=1000) 和 (30\cdot10=300)，而列积是 (20\cdot30=600) 和 (50\cdot10=500)。 求解器对剩余的乘积使用普通整数除法，因此上限的值不会导致特殊的算术情况。 

最后，相同的目标产品并不意味着相同的单元值。 在所有行积等于(60)的(4\times4)情况下，不同行可以使用不同的(60)因子对。 全局唯一性检查涉及单元格中放置的数字，而不是所需的行和列乘积，因此当相应的因子对可以保持不同时，重复的目标值完全有效。
