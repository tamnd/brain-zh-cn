---
title: "CF 102439C - 蟑螂赛车"
description: "我们有 n 只蟑螂，每只蟑螂的背面都写有 m 位数字。 有些数字是已知的，而每个？ 可以独立地替换为 0 到 9 之间的任何数字。允许使用前导零。"
date: "2026-08-12T08:11:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "C"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 235
verified: true
draft: false
---

[CF 102439C - 蟑螂赛车](https://codeforces.com/problemset/problem/102439/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`蟑螂，每只蟑螂都有一个`m`背面写有数字。 有些数字是已知的，而每个数字`?`可以独立地替换为任意数字`0`到`9`。 允许使用前导零。 

替换所有问号后，所得数字必须满足

 [
 x_1 < x_2 < \点 < x_n。 
]

 我们的任务不是构建一个这样的序列。 我们必须考虑每一个有效的修复体并添加所有的值`n`该修复中出现的数字。 最终的答案就是这个总模（10^9+7）。 官方的限制是(n,m\le 50)，时间限制为1.5秒。 

因为每个数字都具有相同的长度，所以按数字比较两个数字与按字典顺序比较它们的数字字符串完全相同。 两个数字不同的第一个位置决定了它们的顺序。 

50 的界限对于蟑螂间隔内的动态规划来说足够小，但对于任何一个指数的情况来说都太小了`n`或者`m`。 如果全部`n*m`位置是问号，有(10^{nm})个修复体。 在最大尺寸下，这是 (10^{2500}) 种可能性。 即使在 (O(nm)) 时间内检查一次恢复也会给出大约 (2450\cdot10^{2500}) 数字比较，因此暴力破解是完全不可能的。 

三种边缘情况往往会导致无声错误。 

首先，订单是严格递增的，而不是非递减的。 为了```
2 1
?
?
```有效对是 45 对 (0<1,0<2,\ldots,8<9) 及其组合。 每个数字恰好出现在 9 个有效对中，因此答案是 (9(0+1+\dots+9)=405)。 治疗`<=`有效会错误地包含相等的对并产生 495。 

其次，前导零是真实数字，不能被丢弃。 为了```
2 2
0?
10
```第一个数字可以是`00`通过`09`，而第二个数字是`10`。 所有十个修复体均有效，总计为

 [
 (0+1+\点+9)+10\cdot10=145。 
]

 解释的实现`0?`因为无效的表示会错误地拒绝所有这些。 

第三，前面的数字相等并不意味着两个数字相等。 为了```
2 2
??
??
```两个数字可能具有相同的第一位数字，并且如果它们的第二位数字严格递增，则仍然形成有效对。 等前缀情况必须继续到下一个数字，而不是立即被拒绝。 

## 方法

 直接的方法是独立替换每个问号，构造所有结果数字，并测试序列是否严格递增。 它是正确的，因为它明确地检查了每一个可能的恢复。 它的问题是搜索空间。 和`q`问号它考虑 (10^q) 分配，并且在最坏的情况下 (q=nm=2500)。 即使在考虑计算请求总和的成本之前，这也会给出 (10^{2500}) 个候选，因此暴力破解是不可用的。 

有用的观察是，当我们一次检查一位数字位置时，递增序列具有非常特定的结构。 

假设连续的蟑螂区间当前具有相同的前缀。 在下一个数字上，他们选择的数字必须是非递减的。 每当两个连续的蟑螂之间的数字严格增加时，这两侧就已经永远有序，因此该区间分裂成两个独立的组。 获得相同数字的蟑螂仍属于同一组，并且必须按其剩余的后缀进行排序。 

例如，如果四只蟑螂当前共享相同的前缀，并且它们的下一个数字是

 [
 2,2,5,8,
 ]

 然后序列分成几组`[1,2]`,`[3,3]`， 和`[4,4]`。 第一组仍需要其后缀不断增加，而其他两组各包含一只蟑螂，无需进一步排序。 

这将比较状态的指数集转变为区间动态程序。 定义`cnt[l][r]`为有效方法数，填写剩余后缀时蟑螂`l`通过`r`当前具有相同的前缀。 还定义`sum[l][r]`作为这些方式上所有数值的总和，仅考虑剩余的后缀。 

在一位数字上，一个区间被分成连续的块。 每个块接收一位数字，块数字严格递增，不同块的后缀是独立的。 一块`[k,r]`允许接收数字`d`正是当每个模式来自`k`通过`r`接受`d`在这个位置。 

我们可以枚举最后一个块以及分配给它的数字。 前面的块必须使用较小的数字。 由于只有十个可能的数字，我们为最后一位数字保留另一个小的 DP 维度。 这给出了 (O(10mn^3)) 时间，这对于`n,m <= 50`。 

同一个 DP 可以携带总和以及计数。 当两个独立的块组合在一起时，它们的计数会相乘。 他们的总和加起来为

 [
 S = S_1C_2+C_1S_2。 
]

 当前数字将其值乘以适当的十次方，整个区间内的每只蟑螂一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nm\cdot10^{nm})) | (O(nm)) | 太慢了|
 | 间隔 DP | (O(1000 万^3)) | (O(n^2+mn)) | 已接受 |

 ## 算法演练

 1. 将每个模式位置转换为十位掩码。 少量`d`当数字被设置`d`可以放在那个位置。 这使得检查整个区间是否可以接收一位数成为整数位操作。 
2. 从右到左处理数字位置。 开始时，没有剩余数字。 因此，包含一只蟑螂的区间具有 1 个有效的空后缀，而包含至少两只蟑螂的区间则具有 0 个有效后缀，因为不允许有相等的完整数。 
3.对于当前的数字位置，考虑一个区间`[l,r]`其先前的前缀对于其中的每只蟑螂都是相同的。 所选的当前数字必须是非递减的。 相等的数字形成一个块，而严格的增加则分隔两个独立的块。 
4.修正数字`d`最后一个块的`[k,r]`。 仅当每个模式来自`k`通过`r`接受`d`。 对于每个位置和数字，我们预先计算第一个索引，从中结束的间隔`r`可以完全由接受该数字的模式组成。 这避免了在转换内单独检查每个字符。 
5. 部分`[l,k-1]`，如果非空，则必须以小于的数字结尾`d`。 对于每一个可能`k`，前缀 DP 告诉我们所有此类先前块的路数和后缀总和。 街区`[k,r]`贡献其已经计算出的`cnt[k][r]`和`sum[k][r]`。 
6. 将前面的部分和最后的块结合起来。 如果他们的计数是`C1`和`C2`，合并计数为`C1*C2`。 如果他们的总和是`S1`和`S2`，组合后缀之和为`S1*C2 + C1*S2`，因为第一部分的每个作业都可以与第二部分的每个作业配对。 
7. 计算当前数字的 DP 后，将当前数字本身添加到总和中。 如果区间包含`r-l+1`蟑螂，当前位置有位置值（10^{m-1-p}），分配数字`d`贡献

 [
 d\cdot(r-l+1)\cdot10^{m-1-p}
 ]

 到该州统计的每一项任务。 

1. 所有仓位处理完毕后，`cnt[0][n-1]`计算每个有效的完整序列并且`sum[0][n-1]`正是所要求的总数。 

### 为什么它有效

 不变的是`cnt[l][r]`和`sum[l][r]`准确描述蟑螂的所有有效后缀分配`l..r`假设它们已经处理的前缀是相等的。 在当前数字处，每个有效分配都有一个唯一的分区，划分为具有相同当前数字的最大连续块。 这些块的位数是严格递增的，不同的块可以独立完成。 转换枚举了每个可能的最后一个块及其每个可能的数字，因此每个有效分配都被精确计算一次。 相反，每次转换都会创建非递减的当前数字和递归有效的后缀，因此它会创建严格递增的序列。 通过相同的分解进行计数和求和即可给出所请求的总数，而无需枚举单独的分配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n, m = map(int, input().split())
    patterns = [input().strip() for _ in range(n)]

    # allowed[pos][i] is a bit mask of digits allowed for cockroach i.
    allowed = [[0] * n for _ in range(m)]

    for i in range(n):
        s = patterns[i]
        for p, ch in enumerate(s):
            if ch == '?':
                allowed[p][i] = (1 << 10) - 1
            else:
                allowed[p][i] = 1 << (ord(ch) - ord('0'))

    # next_cnt[l][r], next_sum[l][r]:
    # valid completions for positions p+1 ... m-1,
    # assuming positions before p are equal for l..r.
    next_cnt = [[0] * n for _ in range(n)]
    next_sum = [[0] * n for _ in range(n)]

    for i in range(n):
        next_cnt[i][i] = 1

    pow10 = [1] * m
    for i in range(1, m):
        pow10[i] = pow10[i - 1] * 10 % MOD

    for p in range(m - 1, -1, -1):
        # start[d][r] is the first k such that every pattern k..r
        # accepts digit d at position p.
        start = [[0] * n for _ in range(10)]
        last_bad = [-1] * 10

        for r in range(n):
            mask = allowed[p][r]
            for d in range(10):
                if not (mask >> d) & 1:
                    last_bad[d] = r
                start[d][r] = last_bad[d] + 1

        cur_cnt = [[0] * n for _ in range(n)]
        cur_sum = [[0] * n for _ in range(n)]

        for l in range(n):
            # fcnt[r][d]:
            # ways for [l,r] where the last current-digit block uses d.
            #
            # fsum[r][d]:
            # corresponding sum, including positions p+1..m-1,
            # but not yet the current digit at p.
            fcnt = [[0] * 10 for _ in range(n)]
            fsum = [[0] * 10 for _ in range(n)]

            # Prefix sums over the possible last digit.
            pref_cnt = [[0] * 10 for _ in range(n)]
            pref_sum = [[0] * 10 for _ in range(n)]

            weight = pow10[m - 1 - p]

            for r in range(l, n):
                row_sum = 0

                for d in range(10):
                    lo = max(l, start[d][r])
                    if lo > r:
                        continue

                    ways = 0
                    total = 0

                    for k in range(lo, r + 1):
                        block_cnt = next_cnt[k][r]
                        if block_cnt == 0:
                            continue

                        block_sum = next_sum[k][r]

                        if k == l:
                            prev_cnt = 1
                            prev_sum = 0
                        elif d == 0:
                            continue
                        else:
                            prev_cnt = pref_cnt[k - 1][d - 1]
                            prev_sum = pref_sum[k - 1][d - 1]

                        ways += prev_cnt * block_cnt
                        total += prev_sum * block_cnt + prev_cnt * block_sum

                    fcnt[r][d] = ways % MOD
                    fsum[r][d] = total % MOD

                    row_sum += fsum[r][d]

                # Build prefix sums for this r.
                pc = 0
                ps = 0
                for d in range(10):
                    pc += fcnt[r][d]
                    ps += fsum[r][d]
                    pref_cnt[r][d] = pc % MOD
                    pref_sum[r][d] = ps % MOD

                total_cnt = pc % MOD

                # Add the current digit to every cockroach in [l,r].
                size = r - l + 1
                digit_contribution = 0

                for d in range(10):
                    digit_contribution += (
                        d * size * weight * fcnt[r][d]
                    )

                cur_cnt[l][r] = total_cnt
                cur_sum[l][r] = (
                    row_sum + digit_contribution
                ) % MOD

        next_cnt = cur_cnt
        next_sum = cur_sum

    print(next_sum[0][n - 1] % MOD)

if __name__ == "__main__":
    solve()
```实现的第一部分将每个模式位置转换为数字掩码。 一个`?`获取全部十位，而固定数字恰好获取一位。 摄影指导再也不用检查原来的角色了。`next_cnt`和`next_sum`表示当前位置被移除后的状态。 对角线条目被初始化为一，因为一只蟑螂总是只有一个空后缀。 长度至少为 2 的区间从零开始，因为相等的完整数不能满足严格的排序。 

对于每个位置，`start[d][r]`记录结束于的块的左侧距离`r`可以扩展，同时仍然允许数字`d`。 如果图案`r`拒绝`d`，不存在这样的块。 否则边界由最近的模式拒绝确定`d`。 这是转换使用的区间有效性条件。 

对于固定的起点`l`,`fcnt[r][d]`和`fsum[r][d]`描述所有分区`[l,r]`谁的最后一个块接收数字`d`。 过渡选择开始`k`最后一个块的。 前面的部分必须以较小的数字结尾，这就是为什么`pref_cnt[k-1][d-1]`和`pref_sum[k-1][d-1]`被使用。 

这`k == l`case 表示最终块之前的空前缀。 它的计数为 1，其总和为零。 对于第一个块占据整个区间的区间来说，这种边界情况是必要的。 

总和转换使用计数乘法，因为两个块在当前数字不同后是独立的。 相应的总和使用`prev_sum * block_cnt + prev_cnt * block_sum`，这说明了一侧的每个作业都可以与另一侧的每个作业配对的事实。 

最后，`digit_contribution`将当前数字添加到间隔中的每只蟑螂上。 乘以`pow10[m-1-p]`是将数字转换为其实际数字位值的函数。 Python 整数不会溢出，但所有 DP 值都会按模 (10^9+7) 减少，因此中间值仍然足够小，可以进行高效算术。 

## 工作示例

 ### 示例 1

 输入是```
2 2
??
??
```在最后一个位置，两只单独的蟑螂各有十种选择。 对于包含两只蟑螂的区间，最后一位数字必须满足`a < b`，给出 45 种可能性。 

| 职位| 间隔 | 计数 | 后缀总和|
 | --- | --- | --- | --- |
 | 1 |`[0,0]`| 10 | 10 45 | 45
 | 1 |`[1,1]`| 10 | 10 45 | 45
 | 1 |`[0,1]`| 45 | 45 405 | 405
 | 0 |`[0,0]`| 100 | 100 4500 |
 | 0 |`[1,1]`| 100 | 100 4500 |
 | 0 |`[0,1]`| 4950 | 4950 490050 | 490050

 在位置 0，两个不同的第一位数字立即建立排序，而相同的第一位数字将后缀比较留给为位置 1 计算的状态。最终的总和是```
490050
```与样本相匹配。 

### 示例 2

 输入是```
2 3
4??
??2
```在最后一位数字上，第一只蟑螂可以使用`0`或者`1`当前缀仍然相等时，因为第二只蟑螂被迫使用`2`。 这给出了两个后缀对和后缀和`5`。 

在下一个位置，两个数字可以已经不同，也可以相等，让最终的位置决定顺序。 

| 职位| 间隔 | 计数 | 从当前后缀开始的总和 |
 | --- | --- | --- | --- |
 | 2 |`[0,1]`| 2 | 5 |
 | 1 |`[0,1]`| 470 | 470 45275 | 45275
 | 0 |`[0,1]`| 5470| 6403775 |

 在位置 0 处，第一个数字以`4`。 如果第二个数字开头为`5`通过`9`，顺序已经决定，剩下的两个后缀都是独立的。 如果它也开始于`4`，具有 470 个有效完成的后缀状态被重用。 结合这些案例给出最终答案`6403775`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(1000 万^3)) | 对于每个数字位置、起始间隔、结束间隔、数字和可能的最终块边界，都会处理一个转换。 |
 | 空间| (O(n^2+mn)) | 二`n x n`DP 层与输入掩码和小型每个位置辅助数组一起存储。 |

 对于 (n,m\le50)，三次因子是可控的，因为数字维度仅为 10，并且每个位置的区间转换仅包含大约 (O(n^3)) 种组合。 该算法避免了对 (10^{nm}) 的所有依赖，这是这些约束的关键要求。 

## 测试用例```python
import sys
import io

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())
    patterns = [input().strip() for _ in range(n)]

    allowed = [[0] * n for _ in range(m)]

    for i in range(n):
        s = patterns[i]
        for p, ch in enumerate(s):
            if ch == '?':
                allowed[p][i] = (1 << 10) - 1
            else:
                allowed[p][i] = 1 << (ord(ch) - ord('0'))

    next_cnt = [[0] * n for _ in range(n)]
    next_sum = [[0] * n for _ in range(n)]

    for i in range(n):
        next_cnt[i][i] = 1

    pow10 = [1] * m
    for i in range(1, m):
        pow10[i] = pow10[i - 1] * 10 % MOD

    for p in range(m - 1, -1, -1):
        start = [[0] * n for _ in range(10)]
        last_bad = [-1] * 10

        for r in range(n):
            mask = allowed[p][r]
            for d in range(10):
                if not ((mask >> d) & 1):
                    last_bad[d] = r
                start[d][r] = last_bad[d] + 1

        cur_cnt = [[0] * n for _ in range(n)]
        cur_sum = [[0] * n for _ in range(n)]

        weight = pow10[m - 1 - p]

        for l in range(n):
            fcnt = [[0] * 10 for _ in range(n)]
            fsum = [[0] * 10 for _ in range(n)]
            pref_cnt = [[0] * 10 for _ in range(n)]
            pref_sum = [[0] * 10 for _ in range(n)]

            for r in range(l, n):
                row_sum = 0

                for d in range(10):
                    lo = max(l, start[d][r])
                    if lo > r:
                        continue

                    ways = 0
                    total = 0

                    for k in range(lo, r + 1):
                        block_cnt = next_cnt[k][r]
                        if block_cnt == 0:
                            continue

                        block_sum = next_sum[k][r]

                        if k == l:
                            prev_cnt = 1
                            prev_sum = 0
                        elif d == 0:
                            continue
                        else:
                            prev_cnt = pref_cnt[k - 1][d - 1]
                            prev_sum = pref_sum[k - 1][d - 1]

                        ways += prev_cnt * block_cnt
                        total += prev_sum * block_cnt
                        total += prev_cnt * block_sum

                    fcnt[r][d] = ways % MOD
                    fsum[r][d] = total % MOD
                    row_sum += fsum[r][d]

                pc = 0
                ps = 0

                for d in range(10):
                    pc += fcnt[r][d]
                    ps += fsum[r][d]
                    pref_cnt[r][d] = pc % MOD
                    pref_sum[r][d] = ps % MOD

                size = r - l + 1
                digit_sum = 0

                for d in range(10):
                    digit_sum += d * size * weight * fcnt[r][d]

                cur_cnt[l][r] = pc % MOD
                cur_sum[l][r] = (row_sum + digit_sum) % MOD

        next_cnt = cur_cnt
        next_sum = cur_sum

    print(next_sum[0][n - 1] % MOD)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("""2 2
??
??
""") == "490050", "sample 1"

assert run("""2 3
4??
??2
""") == "6403775", "sample 2"

assert run("""4 1
0
?
4
8
""") == "42", "sample 3"

# Minimum-size input
assert run("""1 1
?
""") == "45", "single question mark"

# Strict inequality boundary
assert run("""2 1
?
?
""") == "405", "strictly increasing, not nondecreasing"

# Leading zeroes are valid
assert run("""2 2
0?
10
""") == "145", "leading zeroes"

# Fixed increasing sequence
assert run("""3 1
1
2
3
""") == "6", "fixed increasing sequence"

# All equal values give no valid sequence
assert run("""3 1
7
7
7
""") == "0", "equal values"

# Maximum-size input, deliberately impossible
maximum = "50 50\n" + ("0" * 50 + "\n") * 50
assert run(maximum) == "0", "maximum-size impossible input"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / ?`|`45`| 最小尺寸和单间隔DP |
 |`2 1 / ? / ?`|`405`| 严格的不平等和等值拒绝|
 |`2 2 / 0? / 10`|`145`| 前导零 |
 |`3 1 / 1 / 2 / 3`|`6`| 完全固定有效序列 |
 |`3 1 / 7 / 7 / 7`|`0`| 一切平等的价值观|
 |`50 50`全零 |`0`| 最大尺寸输入和不可能间隔 |

 ## 边缘情况

 严格不平等的情况```
2 1
?
?
```从两个单元素区间的基态开始。 在唯一的数字位置，两个元素必须形成两个不同的块，第一个块的数字小于第二个块的数字。 这样的数字对有 45 个。 所有对的两位数之和为 405，因此 DP 准确返回`405`。 相同的数字永远不会进入转换，因为最后的数字位置没有后缀来分隔它们。 

对于前导零，```
2 2
0?
10
```第一个模式代表十个值`00,01,...,09`，而第二个是`10`。 第一个数字总是较小，因此有十个有效序列。 他们的总数是 145。 DP 对待`0`作为普通允许的数字，并且永远不会过早地将模式转换为整数，因此前导零不会导致特殊情况。 

对于相等的前缀，```
2 2
??
??
```两只蟑螂的第一个数字可能相同。 在这种情况下，间隔仍然是单个块，并且 DP 使用下一个数字的状态。 在第二位，只有严格递增的对才能生存。 这正是递归可以处理相等前缀而无需为每个相邻对存储显式比较状态的原因。 

对于不可能的序列，例如```
3 1
7
7
7
```基本状态不包含长度大于 1 的有效区间。 处理唯一的数字不能将三个蟑螂分成不同的数字，因为每个模式只接受`7`。 结果计数和总和均为零。 

对于最大尺寸全零输入，每个区间在每个位置都不可能包含两个或多个蟑螂。 DP 仍然处理完整的`50 x 50`例如，但所有非单一状态保持为零。 答案是`0`，并且内存使用量仍然是二次方`n`。
