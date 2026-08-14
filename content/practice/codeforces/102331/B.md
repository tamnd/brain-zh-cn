---
title: "CF 102331B - 按位异或"
description: "我们有一个最多包含 (300000) 个整数的数组，每个整数最多使用 60 位，以及一个阈值 (x)。 当每对选定的数组元素具有至少 (x) 的 XOR 时，子序列被认为是好的。"
date: "2026-08-14T01:11:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "B"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 367
verified: true
draft: false
---

[CF 102331B - 按位异或](https://codeforces.com/problemset/problem/102331/B)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多包含 (300000) 个整数的数组，每个整数最多使用 60 位，以及一个阈值 (x)。 当每对选定的数组元素具有至少 (x) 的 XOR 时，子序列被认为是好的。 任务是计算所有非空的好子序列，答案取模（998244353）。 原问题使用 2 秒时间限制和 1 GiB 内存限制。 

数组的原始顺序仅决定哪些索引形成子序列。 条件本身仅取决于所选的值。 这意味着我们可以首先对值进行排序，并从排序顺序中计算有效选择。 排序不会丢失任何子序列：相等的值仍然是单独的元素，并且在排序后位置的每个子集仍然对应于原始位置的一个子集。 

界限 (n\le300000) 立即排除 (n) 中的任何二次方，因为 (n^2) 约为 (9\cdot10^{10})。 60 位界限更加有用：一次检查一位的操作可以为每个元素提供大约 60 次工作，从而给出 (O(60n)) 算法。 大内存限制也使得 C++ 中的 trie 变得很自然，但一个简单的 60 级 trie 可以包含数千万个节点，这在 Python 中是不必要的昂贵。 下面的实现使用压缩的二进制 trie，仅保留分支节点，因此其大小与不同值的数量呈线性关系。 

有几种边缘情况可能会悄悄地破坏粗心的实现。 当(x=0)时，每个异或都是非负的，因此每个非空子序列都是有效的。 例如，输入`3 0`有价值观`0 1 2`有答案（2^3-1=7）。 将相等视为无效的解决方案会错误地排除异或为零的对。 

当出现相等值且 (x>0) 时，无法同时选择相同值的两个副本，因为它们的 XOR 为零。 例如，`3 1`有价值观`5 5 5`有答案`3`，因为只有三个单例子序列有效。 一个粗心的解决方案，对数组进行重复数据删除将会得到`1`，因为三个相等的位置仍然是三个不同的子序列选择。 

边界 (a_i\oplus a_j=x) 有效，因为条件大于或等于 (x)。 例如，`2 2`有价值观`0 2`有答案`3`：单例和配对都是有效的，因为 (0\oplus2=2)。 一个实现使用`>`而不是`>=`会回来`2`。 

最后，排序对于归约至关重要，但排序后的位置并不是原始的子序列索引。 例如，`3 2`有价值观`2 0 1`仍有答案`5`。 假设原始数组已经排序的解决方案将错过有效的转换。 

## 方法

 直接的暴力方法是枚举每个非空子序列并检查其中的所有对。 对于大小 (k) 的子集，这需要 (\binom{k}{2}) 异或比较。 对所有子集求和，最坏情况下的配对检查次数为

 \binom n2 2^{n-2}。 
]

 对于 (n=300000)，这超出了任何实际限制。 即使枚举子集而不检查所有对也已经需要 (2^n) 次操作。 

第一个有用的观察来自对值的排序。 假设 (a\le b\le c)。 查看三个数字不相等的最高位。 只有两种可能。 (a) 在该位不同于 (b) 和 (c)，或者 (c) 与 (a) 和 (b) 都不同。 在第一种情况下，(a\oplus b) 和 (a\oplus c) 具有高位设置，而 (b\oplus c) 没有，因此 (b\oplus c) 比两者都小。 在第二种情况下，(a\oplus b) 小于其他两个 XOR。 因此，

 [
 \min(a\oplus b,b\oplus c)\le a\oplus c。 
]

 该属性具有很强的后果。 按排序顺序取任何选定的值，

 [
 b_1\le b_2\le\cdots\le b_k。 
]

 如果每对连续的选定值具有至少 (x) 的 XOR，则每个非连续的选择值也至少具有 (x) 的 XOR。 对于三个连续的选定值，上面的不等式表明，外部对的 XOR 至少是两个相邻对中较小的 XOR。 重复应用相同的参数可以将其扩展到任意距离。 

因此，排序后，原来的全对条件就变成了局部条件：当每两个连续的选定值具有至少 (x) 的 XOR 时，子序列恰好有效。 

这将计数问题变成了动态规划。 令 (f_i) 为最后选择的元素是排序数组中第 (i) 个值的有效子序列的数量。 最后一个元素可以单独存在，给出一个子序列。 否则，我们将 (a_i) 附加到以某个 (j<i) 结尾的任何有效子序列

 [
 a_j\oplus a_i\ge x。 
]

 因此

 1+
 \sum_{\substack{j<i\a_j\oplus a_i\ge x}}f_j。 
]

 剩下的问题是有效地计算这个加权异或阈值查询。 

标准的二进制 trie 可以在 (O(60)) 中解决查询。 在每一位上，我们将 XOR 位与 (x) 的相应位进行比较。 如果(x)的对应位为零，则将XOR位取为1使得整个XOR变大，而不管较低位如何，从而可以立即添加整个trie子树。 如果(x)的位为1，则XOR位也必须为1以保持等于(x)的前缀，因此只有一个分支可以继续。 

通常的 trie 最多有 (60n) 个节点。 这在低级语言中是可以接受的，但在 Python 中却很糟糕。 由于所有值在 DP 开始之前都是已知的，因此我们可以构建一个仅包含分支点的压缩二进制 trie。 压缩的 trie 具有 (O(n)) 个节点，而查询仍最多遵循 60 个分支级别。 

比较结果为：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2 2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 标准二进制 trie DP | (O(n\log A)) | (O(n\log A)) | 接受低级语言 |
 | 压缩二进制 trie DP | (O(n\log A)) | (O(n)) | (O(n)) | 已接受 |

 这里（\log A\le60）。 

## 算法演练

 1. 对数组进行非降序排序。 现在可以通过仅检查连续选定的值来替换原始的全对条件，因为对于 (a\le b\le c)，

 [
 \min(a\oplus b,b\oplus c)\le a\oplus c。 
]

 因此，如果连续选择的对都满足阈值，则所有其他对也满足阈值。

1. 将相等的值分组到压缩二进制 trie 的一个叶子中。 DP仍然单独处理相等的出现，因此这只是值空间的结构压缩，而不是数组元素的移除。 
2. 递归地构建压缩特里树。 对于一组至少两个不同的值，找到最小值和最大值不同的最高位。 该位将集合分为零组和一组，这两个组是连续的，因为值已排序。 递归地构建两个组。 
3. 给每个 trie 节点一个子树和。 该总和表示其值属于该子树的已处理数组元素的总数 (f_j)。 最初，每个总和都为零。 
4. 从左到右处理排序后的数组。 对于当前值 (v)，查询 trie 以获得满足以下条件的先前值 (y) 的总 DP 权重

 [
 v\oplus y\ge x。 
]

 调用返回的总和 (q)。 然后

 [
 f=1+q。 
]

这`1`表示仅包含当前位置的单例子序列。 

1. 将 (f) 添加到全局答案中，并将该 DP 权重插入表示 (v) 的叶子中。 权重也会通过每个祖先传播，以便将来的查询看到正确的子树总和。 
2. 要执行压缩特里查询，请保持与 (x) 的比较到目前为止相等。 在内部节点，其分支位是其两个子节点中的值可能不同的下一位。 在使用该位之前，整个子树中压缩跳过的位是固定的。 将这些固定位与 (x) 进行比较。 如果固定的XOR前缀已经大于(x)，则可以添加整个子树。 如果较小，则可以丢弃整个子树。 
3. 如果固定前缀相等，则检查分支位。 当 (x) 的相应位为零时，产生 XOR 位 1 的子级完全有效并且可以添加，而产生 XOR 位 0 的子级则继续相等路径。 当(x)的对应位为1时，只有产生XOR位1的子级可以继续。 
4. 在叶子处，所有位都是固定的，因此直接测试其值与当前值异或是否至少为(x)。 然后，叶子存储的总和将被包含或忽略。 
5. 对每个 DP 值取模 (998244353)。 Python 整数不会溢出，但加法后减少可以使存储的子树总和保持较小并匹配所需的输出模数。 

工作原理：排序后，关键的不变量是 (f_i) 计数的部分子序列在其连续选择的值满足 XOR 阈值时准确有效。 转换考虑满足该阈值的每个可能的先前端点，因此以 (i) 结尾的每个有效子序列都被精确计数一次。 压缩的 trie 不会更改存储值的集合。 它仅跳过子树中每个值都具有相同位的位位置，并且这些跳过的位可以与作为固定前缀的 (x) 进行比较。 因此，查询添加的每个子树完全由有效的前驱组成，而每个丢弃的子树完全由无效的前驱组成。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

MOD = 998244353
TOP = 59

def solve():
    n, x = map(int, input().split())
    a = list(map(int, input().split()))
    a.sort()

    # Only distinct values need structural nodes.
    vals = []
    for v in a:
        if not vals or vals[-1] != v:
            vals.append(v)

    m = len(vals)

    # Compressed binary trie.
    #
    # bit[u]  : branching bit, -1 for a leaf
    # left[u] : child with bit 0
    # right[u]: child with bit 1
    # rep[u]  : any representative value in the subtree
    # total[u]: sum of dp values currently stored in the subtree
    # parent[u]: parent node
    bit = []
    left = []
    right = []
    rep = []
    total = []
    parent = []

    leaf_of = {}

    def new_node(b, lch, rch, representative, par):
        idx = len(bit)
        bit.append(b)
        left.append(lch)
        right.append(rch)
        rep.append(representative)
        total.append(0)
        parent.append(par)
        return idx

    def build(lo, hi, par):
        if hi - lo == 1:
            v = vals[lo]
            u = new_node(-1, -1, -1, v, par)
            leaf_of[v] = u
            return u

        diff = vals[lo] ^ vals[hi - 1]
        b = diff.bit_length() - 1
        threshold = ((vals[lo] >> (b + 1)) << (b + 1)) | (1 << b)

        mid = bisect_left(vals, threshold, lo, hi)

        u = new_node(b, -1, -1, vals[lo], par)
        lc = build(lo, mid, u)
        rc = build(mid, hi, u)
        left[u] = lc
        right[u] = rc
        return u

    root = build(0, m, -1)

    def query(v):
        """
        Return the sum of dp values stored at y such that
        y xor v >= x.
        """
        u = root
        ans = 0

        # All bits above `top` are already known to be equal
        # between (representative xor v) and x.
        top = TOP

        while True:
            b = bit[u]

            if b == -1:
                if (rep[u] ^ v) >= x:
                    ans += total[u]
                    if ans >= MOD:
                        ans -= MOD
                return ans

            z = rep[u] ^ v

            # Bits b+1 ... top are fixed for the whole subtree.
            # If they already differ from x, the whole subtree has
            # the same comparison result.
            d = (z ^ x) >> (b + 1)
            if d:
                highest = b + 1 + d.bit_length() - 1
                if (z >> highest) & 1:
                    ans += total[u]
                    if ans >= MOD:
                        ans -= MOD
                return ans

            vb = (v >> b) & 1
            xb = (x >> b) & 1

            if xb == 0:
                # XOR bit 1 is already larger than x at this bit.
                greater_child = right[u] if vb == 0 else left[u]
                if greater_child != -1:
                    ans += total[greater_child]
                    if ans >= MOD:
                        ans -= MOD

                # XOR bit 0 keeps the prefix equal.
                equal_child = left[u] if vb == 0 else right[u]
            else:
                # XOR bit 0 would make the result smaller.
                # Only XOR bit 1 can keep equality.
                equal_child = right[u] if vb == 0 else left[u]

            if equal_child == -1:
                return ans

            u = equal_child
            top = b - 1

    answer = 0

    for v in a:
        dp = query(v) + 1
        if dp >= MOD:
            dp -= MOD

        answer += dp
        if answer >= MOD:
            answer -= MOD

        u = leaf_of[v]
        while u != -1:
            total[u] += dp
            if total[u] >= MOD:
                total[u] -= MOD
            u = parent[u]

    print(answer)

if __name__ == "__main__":
    solve()
```第一部分对数组进行排序并创建`vals`，不同值的排序列表。 重复项保留在`a`，因为每次出现都代表不同的数组位置，因此代表不同的可能子序列。 压缩特里树只为每个不同值存储一个结构叶。 

这`build`函数查找子树的最小值和最大值之间不同的最高位。 由于这是第一个不同的位，因此它下面的所有值都具有相同的高位前缀。 该位等于 0 的值形成一个连续范围，等于 1 的值形成另一个连续范围。 生成的树最多具有 (2m-1) 个节点（m）个不同值。 

这`total`array 存储每个子树中 DP 值的总和。 因此，更新叶子需要遍历它的祖先。 一条路径最多有 60 个分支级别，因此更新成本 (O(60))。 

微妙的部分是`query`。 普通的二进制特里树在每个位位置都有一个节点。 压缩的特里树会跳过所有值都一致的位置。 在压缩节点，`rep[u]`表示该子树中每个值的跳过位。 表达式```
d = (z ^ x) >> (b + 1)
```检查跳过的前缀是否已与 (x) 不同。 如果是，则最高的不同位决定子树中每个值的比较，因此查询可以立即终止。 

当前缀相等时，当前分支位的处理方式与普通 XOR 阈值 trie 完全相同。 对于 (x) 位为零，产生 XOR 位 1 的分支是完全有效的。 对于 (x) 位为 1，产生 XOR 位 0 的分支完全无效。 只有平等分支需要进一步检查。 

该查询在插入当前 DP 值之前执行。 这就是保证 (f_i) 只使用 (j<i) 的原因。 然后单独添加单例贡献`+1`。 

这些值可以大到 (2^{60}-1)，因此最高相关位是 59。Python 具有任意精度整数，因此不需要溢出处理。 模数应用于每个存储的总和以及每次加法后的答案。 

## 工作示例

 ### 示例 1

 输入是`n=3`,`x=0`，排序后的值是`0,1,2`。 由于每个非负异或至少为零，因此每个子序列都是有效的。 

| 步骤| 值 (v) | 查询结果 | (dp)| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 0 | 1 | 1 |
 | 2 | 1 | 1 | 2 | 3 |
 | 3 | 2 | 3 | 4 | 7 |

 第一个元素没有先前的值，因此仅计算单例。 在第二个元素处，单例和子序列`[0,1]`是有效的。 在第三个元素处，所有四个子序列都以`2`是有效的。 最终答案是(7)，匹配(2^3-1)。 

### 示例 2

 现在 (x=2)，具有排序值`0,1,2`。 

| 步骤| 值 (v) | 之前有效的 DP 总和 | (dp)| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 0 | 1 | 1 |
 | 2 | 1 | 0 | 1 | 2 |
 | 3 | 2 | 2 | 3 | 5 |

 为了`v=1`，唯一的先前值是`0`，且 (0\oplus1=1<2)，因此无法形成该对。 为了`v=2`，之前的两个值都有效，因为 (0\oplus2=2) 和 (1\oplus2=3)。 因此，三个有效的子序列结束于`2`是`[2]`,`[0,2]`， 和`[1,2]`。 答案是`5`。 

第二条轨迹还运用了等式边界：接受 XOR 完全等于 (x)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n+n\cdot60)) | 排序成本 (O(n\log n))，而每个 trie 查询和更新最多遵循 60 个分支位 |
 | 空间| (O(n)) | (O(n)) | 压缩 trie 最多具有 (2m-1) 个节点（m\le n）个不同值 |

 最大输入包含 (300000) 个值，因此 (O(n\log n)) 排序步骤和常数 60 位因子都是实用的。 压缩表示在 Python 中特别有用，因为它避免了未压缩二进制 trie 的大约 (60n) 个节点爆炸。 原始问题提供 1024 MiB 内存，压缩实现使用线性空间。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
import sys
import io
import random

from solution import solve

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
assert run(
    "3 0\n"
    "0 1 2\n"
) == "7", "sample 1"

assert run(
    "3 2\n"
    "0 1 2\n"
) == "5", "sample 2"

assert run(
    "3 3\n"
    "0 1 2\n"
) == "4", "sample 3"

assert run(
    "7 4\n"
    "11 5 5 8 3 1 3\n"
) == "35", "sample 4"

# Minimum-size input
assert run(
    "1 123456789\n"
    "42\n"
) == "1", "single element"

# x = 0: every non-empty subsequence is valid
assert run(
    "4 0\n"
    "7 7 7 7\n"
) == "15", "x = 0"

# Equal values with positive x: only singletons are valid
assert run(
    "4 1\n"
    "5 5 5 5\n"
) == "4", "all equal values"

# Equality boundary: XOR exactly x must be accepted
assert run(
    "2 2\n"
    "0 2\n"
) == "3", "xor exactly x"

# Maximum 60-bit values
M = (1 << 60) - 1
assert run(
    f"3 {M}\n"
    f"0 {M} {M - 1}\n"
) == "4", "60-bit boundary"

# Maximum-size input, x = 0.
# Every one of the 2^n - 1 non-empty subsequences is valid.
n = 300000
big_input = f"{n} 0\n" + ("0 " * n) + "\n"
expected = (pow(2, n, 998244353) - 1) % 998244353
assert run(big_input) == str(expected), "maximum n"

# Small randomized cross-check against brute force.
def brute(a, x):
    n = len(a)
    ans = 0

    for mask in range(1, 1 << n):
        chosen = [a[i] for i in range(n) if mask >> i & 1]
        ok = True

        for i in range(len(chosen)):
            for j in range(i + 1, len(chosen)):
                if (chosen[i] ^ chosen[j]) < x:
                    ok = False
                    break
            if not ok:
                break

        if ok:
            ans += 1

    return ans % 998244353

rng = random.Random(0)

for n in range(1, 8):
    for _ in range(50):
        a = [rng.randrange(16) for _ in range(n)]
        x = rng.randrange(16)

        inp = f"{n} {x}\n" + " ".join(map(str, a)) + "\n"
        expected = brute(a, x)

        assert run(inp) == str(expected), (
            f"random test failed: n={n}, x={x}, a={a}"
        )
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 123456789 / 42`|`1`| 最小尺寸和单例处理 |
 |`4 0 / 7 7 7 7`|`15`| 特殊情况 (x=0) 和重复位置 |
 |`4 1 / 5 5 5 5`|`4`| 当 (x>0) | 时，相等的值不能形成对
 |`2 2 / 0 2`|`3`| 这`>= x`边界|
 |`3 (2^60-1) / 0, 2^60-1, 2^60-2`|`4`| 最高支持位|
 |`300000 0 / 300000 zeros`| (2^{300000}-1\bmod998244353) | 最大值 (n)、大答案和性能 |
 | 具有 (n\le7) | 的随机情况 暴力破解结果 | 交叉检查完整的 DP 和 trie 逻辑 |

 ## 边缘情况

 对于 (x=0)，考虑`4 0`有价值观`7 7 7 7`。 每对的 XOR 至少为零，包括 XOR 为零的等值对。 DP 查询接受每个先前的值，因此 DP 值为 (1,2,4,8)，给出 (15)。 压缩的 trie 不需要 (x=0) 的特殊代码路径，因为在每一位上，异或位 1 已经大于相应的零位，而等式分支最终到达叶子并接受异或零。 

对于所有具有正 (x) 的相等值，考虑`4 1`有价值观`5 5 5 5`。 每对相等值的异或为零，因此只有四个单例子序列有效。 trie 包含一个叶子来存储值`5`，但其存储的权重在每次发生后都会更新。 后来的每个查询都会到达该叶子并拒绝它，因为`5 xor 5 = 0 < 1`。 因此每个 DP 值保持为 1。 

对于平等边界，考虑`2 2`有价值观`0 2`。 加工后`0`，其DP值为1。 加工时`2`，trie 查询看到 (0\oplus2=2)，它恰好是 (x)，因此它包含先前的 DP 值。 因此第二个 DP 值为 2，代表`[2]`和`[0,2]`，最终答案是三。 

对于 60 位边界，请考虑```
3 1152921504606846975
0 1152921504606846975 1152921504606846974
```阈值为(2^{60}-1)。 这对`0`与 (2^{60}-1) 的 XOR 完全等于阈值并且有效。 其他两对的异或值低于阈值，因此有效的子序列是三个单例加上那一对，给出`4`。 该实现检查位 59 到 0，因此处理最高允许位时不会出现差一错误。 

对于 (x=0) 的最大尺寸情况，取 (300000) 个零。 300000 个位置的每个非空子集都是有效的，因此答案是 (2^{300000}-1) 模 (998244353)。 DP 对这些子集进行计数，但不进行枚举。 每个新的零可以扩展每个先前计数的子序列，从而给出熟悉的加倍序列（1,2,4,\ldots），而压缩特里树仅存储一个叶子，因为所有值都是相同的。
