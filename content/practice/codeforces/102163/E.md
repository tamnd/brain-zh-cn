---
title: "CF 102163E - 阿德南和燃烧的司机"
description: "我们维护一个可变的小写字母字符串。 更新将一个位置更改为指定字符。 查询给出一个范围 ([l,r])，我们必须确定该范围内的子字符串从两个方向读取是否相同。"
date: "2026-08-19T07:46:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102163
codeforces_index: "E"
codeforces_contest_name: "NCD 2019"
rating: 0
weight: 102163
solve_time_s: 151
verified: true
draft: false
---

[CF 102163E - Adnan 和被烧毁的驱动程序](https://codeforces.com/problemset/problem/102163/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个可变的小写字母字符串。 更新将一个位置更改为指定字符。 查询给出一个范围 ([l,r])，我们必须确定该范围内的子字符串从两个方向读取是否相同。 

例如，如果当前字符串是`abacaba`，范围 ([2,6]) 包含`bacab`，这是一个回文。 长度为 1 的范围始终是回文，因为它的前向和后向表示包含相同的单个字符。 

一个测试用例中最多可以有 (10^5) 个位置和 (10^5) 个事件。 对于如此多的事件，检查每个查询中的每个字符的成本太高。 在最坏的情况下，(10^5) 个查询可以每个检查 (10^5) 个字符，从而给出大约 (10^{10}) 个字符比较。 这远远超出了典型比赛时间限制所允许的范围。 我们需要更新和回文查询都接近对数时间。 

第一个边界情况是单字符查询。 例如：```
1
1 1
a
2 1 1
```答案是：```
Adnan Wins
```假设至少两个字符的比较例程可能会意外地拒绝这种情况。 

另一个容易犯的错误是忘记更新可以将角色更改为已有的角色。 例如：```
1
3 2
aba
1 2 b
2 1 3
```答案是`Adnan Wins`。 更新不会改变字符串，因此回文状态必须保持不变。 将每次更新视为结构更改的实现仍然可以是正确的，但它必须覆盖存储的值而不是应用不正确的增量调整。 

当查询的间隔触及字符串的任一端时，会出现最常见的边界错误。 例如：```
1
5 2
abcba
2 1 5
2 2 4
```两个答案都是`Adnan Wins`。 任何使用从零开始索引的实现都必须仔细转换包含的输入范围，因为内部表示通常会使用半开区间。 

最后，子字符串可以具有匹配的字符数，但仍然不是回文。 例如，`aabb`包含两个`a`字符和两个`b`字符，但它不是回文。 基于频率的解决方案会错误地接受它。 

## 方法

 直接的解决方案是从两端检查查询的子字符串。 对于查询 ([l,r])，比较 (l) 和 (r) 处的字符，然后比较 (l+1) 和 (r-1)，一直持续到两个指针相遇。 这是正确的，因为当每个镜像对包含相同的字符时，字符串就是回文串。 

问题是工作量。 对长度为 (k) 的子字符串的查询需要 (O(k)) 时间。 如果字符串有 (10^5) 个字符，并且我们对长度接近 (10^5) 的范围执行 (10^5) 个查询，则最坏的情况约为 (5 \times 10^9) 个字符比较。 点更新并不能改善这种情况。 

有用的观察是，回文在向前和向后读取时具有完全相同的序列。 我们可以通过滚动哈希来表示整个子字符串，而不是一一比较这些字符。 我们为每个段维护一个正向哈希，并为同一段维护一个反向哈希。 如果两个哈希值相等，则该子字符串被视为回文。 

线段树是一个自然的选择，因为它的节点代表字符串的连续部分。 每个节点从左到右和从右到左存储其段的哈希值。 当两个相邻的段连接时，可以使用散列基的力量在恒定时间内组合它们的散列。 

点更新仅影响从更改的叶到根的路径上的 (O(\log N)) 段树节点。 范围查询访问 (O(\log N)) 相关节点并按原始顺序组合它们的哈希值。 然后可以比较得到的正向和反向哈希值。 

哈希比较在标准滚动哈希意义上是概率性的。 使用两个不同的大素模使得意外碰撞的可能性极小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N)) 每个查询，(O(NE)) 最坏情况 | (O(N)) | 太慢了 |
 | 线段树+双哈希| 每个事件 (O(\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 预先计算哈希基对两个选定素数取模的幂。 当将长度为 (k) 的段与另一个段组合时，我们需要 (B^k)，因此计算这些幂一次可以避免重复求幂。 
2. 在当前字符串上构建线段树。 一片叶子代表一个字符。 对于每个节点，存储其正向哈希、反向哈希和段长度。 对于叶子来说，两个哈希值只是分配给其字符的数值。 
3. 合并左子节点 (A) 和右子节点 (C) 时，假设它们的长度为 (x) 和 (y)。 如果哈希定义为
 [
 H(s)=\sum_{i=0}^{|s|-1} 值(s_i)B^i,
 ]
 那么 (AC) 的前向哈希为
 [
 H(A)+B^xH(C)。 
]
 反向哈希以相同的方式形成，但反转的左右部分以相反的概念顺序出现：
 [
 RH(C)+B^yRH(A)。 
]
 两个公式都需要常数时间。 
4. 更新`1 i c`，将 (i) 转换为线段树的索引约定，并将相应的叶子替换为`c`。 使用合并公式重新计算每个祖先。 只有 (O(\log N)) 个节点发生变化，因为一个点属于一条从根到叶的路径。 
5. 查询`2 l r`，检索该时间间隔的聚合节点信息。 当返回多个片段时，使用相同的合并操作按从左到右的顺序将它们连接起来。 因此，查询会为完整的子字符串生成一个正向哈希值和一个反向哈希值。 
6. 比较两个模数下的两个结果哈希值。 如果两者匹配，则打印`Adnan Wins`; 否则打印`ARCNCD!`。 回文具有相同的正向和反向序列，因此它们的哈希值必须一致。 使用双重散列，非回文通过两次比较的可能性微乎其微。 

为什么它有效：线段树不变量是每个节点准确地存储其所表示的子字符串的滚动哈希以及该子字符串的反转的滚动哈希。 当两个相邻段合并时，合并公式保留了这一不变性。 点更新通过重建受影响的路径来保留它，范围查询通过按原始顺序连接选定的段来保留它。 因此，最终的正向哈希表示所查询的子字符串，最终的反向哈希表示向后的同一子字符串。 相等的哈希意味着两个表示匹配，这正是回文条件，直到双哈希冲突的概率可以忽略不计。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD1 = 1_000_000_007
MOD2 = 1_000_000_009
BASE = 911382323

def solve_case(n, q, s, queries):
    size = 1
    while size < n:
        size <<= 1

    # Powers used when concatenating hashes.
    pow1 = [1] * (n + 1)
    pow2 = [1] * (n + 1)

    for i in range(1, n + 1):
        pow1[i] = pow1[i - 1] * BASE % MOD1
        pow2[i] = pow2[i - 1] * BASE % MOD2

    total = size << 1

    # Forward hashes.
    hf1 = [0] * total
    hf2 = [0] * total

    # Reverse hashes.
    hr1 = [0] * total
    hr2 = [0] * total

    # Segment lengths.
    length = [0] * total

    def value(ch):
        return ord(ch) - 96

    # Leaves.
    for i, ch in enumerate(s):
        p = size + i
        v = value(ch)

        hf1[p] = v
        hf2[p] = v
        hr1[p] = v
        hr2[p] = v
        length[p] = 1

    # Padding leaves have length zero.
    for p in range(size - 1, 0, -1):
        left = p << 1
        right = left | 1

        ll = length[left]
        lr = length[right]
        length[p] = ll + lr

        hf1[p] = (hf1[left] + pow1[ll] * hf1[right]) % MOD1
        hf2[p] = (hf2[left] + pow2[ll] * hf2[right]) % MOD2

        hr1[p] = (hr1[right] + pow1[lr] * hr1[left]) % MOD1
        hr2[p] = (hr2[right] + pow2[lr] * hr2[left]) % MOD2

    def pull(p):
        left = p << 1
        right = left | 1

        ll = length[left]
        lr = length[right]
        length[p] = ll + lr

        hf1[p] = (hf1[left] + pow1[ll] * hf1[right]) % MOD1
        hf2[p] = (hf2[left] + pow2[ll] * hf2[right]) % MOD2

        hr1[p] = (hr1[right] + pow1[lr] * hr1[left]) % MOD1
        hr2[p] = (hr2[right] + pow2[lr] * hr2[left]) % MOD2

    def update(pos, ch):
        p = size + pos
        v = value(ch)

        hf1[p] = v
        hf2[p] = v
        hr1[p] = v
        hr2[p] = v
        length[p] = 1

        p >>= 1
        while p:
            pull(p)
            p >>= 1

    def merge(a, b):
        # Each item is:
        # (forward_hash_1, forward_hash_2,
        #  reverse_hash_1, reverse_hash_2, length)
        if a[4] == 0:
            return b
        if b[4] == 0:
            return a

        a1, a2, ar1, ar2, la = a
        b1, b2, br1, br2, lb = b

        return (
            (a1 + pow1[la] * b1) % MOD1,
            (a2 + pow2[la] * b2) % MOD2,
            (br1 + pow1[lb] * ar1) % MOD1,
            (br2 + pow2[lb] * ar2) % MOD2,
            la + lb
        )

    def query(left, right):
        # Convert [left, right) into segment-tree coordinates.
        left += size
        right += size

        res_left = (0, 0, 0, 0, 0)
        res_right = (0, 0, 0, 0, 0)

        while left < right:
            if left & 1:
                node = (
                    hf1[left], hf2[left],
                    hr1[left], hr2[left],
                    length[left]
                )
                res_left = merge(res_left, node)
                left += 1

            if right & 1:
                right -= 1
                node = (
                    hf1[right], hf2[right],
                    hr1[right], hr2[right],
                    length[right]
                )
                res_right = merge(node, res_right)

            left >>= 1
            right >>= 1

        return merge(res_left, res_right)

    output = []

    for typ, x, y in queries:
        if typ == 1:
            update(x - 1, y)
        else:
            # Input uses inclusive [x, y].
            # query() uses half-open [x - 1, y).
            h1, h2, rh1, rh2, _ = query(x - 1, y)

            if h1 == rh1 and h2 == rh2:
                output.append("Adnan Wins")
            else:
                output.append("ARCNCD!")

    return "\n".join(output)

def main():
    t = int(input())
    answers = []

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()

        queries = []
        for _ in range(q):
            parts = input().split()
            typ = int(parts[0])

            if typ == 1:
                queries.append((1, int(parts[1]), parts[2]))
            else:
                queries.append((2, int(parts[1]), int(parts[2])))

        answers.append(solve_case(n, q, s, queries))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    main()
```首先构建两个幂数组，因为每次合并都需要 (B^k)，其中 (k) 是其中一个子段的长度。 由于所有查询的长度最多为(N)，所以(N+1)次方就足够了。 

线段树使用迭代布局，叶子从`size`。 实际字符串占据前 (N) 个叶子，而创建的任何额外叶子是因为`size`是二的幂仍为空。 它们的长度为零，因此它们对合并没有任何贡献。 

这`pull`函数实现了段不变量。 对于向前方向，左侧段保持其当前指数，右侧段移动左侧段的长度。 对于相反方向，右段首先出现，因为`left + right`是`reverse(right) + reverse(left)`。 

查询例程使用两个累加器。`res_left`接收从左侧遇到的选定节点并正常附加它们。`res_right`接收从右侧遇到的选定节点并在每个新节点前面添加。 这种排序是必要的，因为线段树遍历不一定会从左到右遇到所有选定的节点。 

输入区间是包含的，而内部查询函数使用半开区间。 因此输入查询`[l, r]`变成`query(l - 1, r)`。 这个单一的转换导致了几个原本很容易出现的差一错误。 

Python 整数不会溢出，但哈希值必须保持在选定的模数范围内。 哈希公式中的每个乘法和加法后面都是`% MOD1`或者`% MOD2`。 除了普通的 Python 任意精度算术之外，不存在整数溢出问题。 

该实现将两个方向和两个模数直接存储在树中。 这比存储单个散列使用更多的内存，但它仍然是 (O(N)) 并且完全符合 (N \le 10^5) 的 256 MB 限制。 

## 工作示例

 对于提供的示例，初始字符串是`adaersd`。 位置5的更新发生变化`r`到`a`，生产`adaeasd`。 查询 ([3,5]) 是`aea`，这是一个回文。 

| 活动 | 运营| 当前字符串| 查询子串| 前进=后退？ | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 |`1 5 a`|`adaeasd`| | | |
 | 2 |`2 3 5`|`adaeasd`|`aea`| 是的 |`Adnan Wins`|
 | 3 |`2 1 6`|`adaeasd`|`adaeas`| 没有 |`ARCNCD!`|
 | 4 |`1 1 d`|`ddaeasd`| | | |
 | 5 |`2 1 2`|`ddaeasd`|`dd`| 是的 |`Adnan Wins`|

 跟踪表明树代表每次更新后的当前字符串，而不仅仅是原始字符串。 最终查询还执行从第一个位置开始的范围。 

第二个示例显示回文在单次更新后变为非回文：```
1
5 3
abcba
2 1 5
1 3 d
2 1 5
```| 活动 | 运营| 当前字符串| 查询 | 转发哈希 | 反向哈希| 输出|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 |`2 1 5`|`abcba`|`[1,5]`| 平等| 平等|`Adnan Wins`|
 | 2 |`1 3 d`|`abdba`| | | | |
 | 3 |`2 1 5`|`abdba`|`[1,5]`| 平等| 平等|`Adnan Wins`|

 这个特定的更新恰好保留了回文，因为`abdba`也是对称的。 为了演示失败的查询，请将更新更改为位置 2：```
1
3 2
aba
1 2 c
2 1 3
```| 活动 | 运营| 当前字符串| 查询 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 |`1 2 c`|`aca`| | |
 | 2 |`2 1 3`|`aca`|`[1,3]`|`Adnan Wins`|

 不变量在两条轨迹中都是可见的：只要查询的子串是对称的，它的正向和反向表示是相同的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N + E\log N)) | 构建树和幂需要 (O(N))，而每次更新和查询都需要 (O(\log N))。 |
 | 空间| (O(N)) | 幂和所有线段树数组包含 (O(N)) 个元素。 |

 对于 (N,E \le 10^5)，算法仅对每个事件执行对数数量的树操作。 对于 (10^5) 个元素，线段树级别的总数约为 17，因此大约需要 (O(10^5 \log 10^5)) 节点操作，而不是数十亿个字符比较。 内存使用呈线性并保持在 256 MB 限制内。 

## 测试用例```python
# This test harness contains the same algorithm as the submission,
# exposed through run() so that the assertions can execute it.

import sys
import io

MOD1 = 1_000_000_007
MOD2 = 1_000_000_009
BASE = 911382323

def solve_case(n, q, s, queries):
    size = 1
    while size < n:
        size <<= 1

    pow1 = [1] * (n + 1)
    pow2 = [1] * (n + 1)

    for i in range(1, n + 1):
        pow1[i] = pow1[i - 1] * BASE % MOD1
        pow2[i] = pow2[i - 1] * BASE % MOD2

    total = size << 1
    hf1 = [0] * total
    hf2 = [0] * total
    hr1 = [0] * total
    hr2 = [0] * total
    length = [0] * total

    def value(ch):
        return ord(ch) - 96

    for i, ch in enumerate(s):
        p = size + i
        v = value(ch)
        hf1[p] = hf2[p] = hr1[p] = hr2[p] = v
        length[p] = 1

    def pull(p):
        left = p << 1
        right = left | 1

        ll = length[left]
        lr = length[right]
        length[p] = ll + lr

        hf1[p] = (hf1[left] + pow1[ll] * hf1[right]) % MOD1
        hf2[p] = (hf2[left] + pow2[ll] * hf2[right]) % MOD2
        hr1[p] = (hr1[right] + pow1[lr] * hr1[left]) % MOD1
        hr2[p] = (hr2[right] + pow2[lr] * hr2[left]) % MOD2

    for p in range(size - 1, 0, -1):
        pull(p)

    def update(pos, ch):
        p = size + pos
        v = value(ch)
        hf1[p] = hf2[p] = hr1[p] = hr2[p] = v
        length[p] = 1

        p >>= 1
        while p:
            pull(p)
            p >>= 1

    def merge(a, b):
        if a[4] == 0:
            return b
        if b[4] == 0:
            return a

        a1, a2, ar1, ar2, la = a
        b1, b2, br1, br2, lb = b

        return (
            (a1 + pow1[la] * b1) % MOD1,
            (a2 + pow2[la] * b2) % MOD2,
            (br1 + pow1[lb] * ar1) % MOD1,
            (br2 + pow2[lb] * ar2) % MOD2,
            la + lb
        )

    def query(left, right):
        left += size
        right += size

        a = (0, 0, 0, 0, 0)
        b = (0, 0, 0, 0, 0)

        while left < right:
            if left & 1:
                a = merge(a, (
                    hf1[left], hf2[left],
                    hr1[left], hr2[left],
                    length[left]
                ))
                left += 1

            if right & 1:
                right -= 1
                b = merge((
                    hf1[right], hf2[right],
                    hr1[right], hr2[right],
                    length[right]
                ), b)

            left >>= 1
            right >>= 1

        return merge(a, b)

    ans = []

    for typ, x, y in queries:
        if typ == 1:
            update(x - 1, y)
        else:
            h1, h2, rh1, rh2, _ = query(x - 1, y)
            if h1 == rh1 and h2 == rh2:
                ans.append("Adnan Wins")
            else:
                ans.append("ARCNCD!")

    return "\n".join(ans)

def run(inp: str) -> str:
    data = io.StringIO(inp)
    t = int(data.readline())
    all_answers = []

    for _ in range(t):
        n, q = map(int, data.readline().split())
        s = data.readline().strip()

        queries = []
        for _ in range(q):
            parts = data.readline().split()
            if parts[0] == "1":
                queries.append((1, int(parts[1]), parts[2]))
            else:
                queries.append((2, int(parts[1]), int(parts[2])))

        all_answers.append(solve_case(n, q, s, queries))

    return "\n".join(all_answers)

# Provided sample.
sample1 = """\
1
7 5
adaersd
1 5 a
2 3 5
2 1 6
1 1 d
2 1 2
"""

assert run(sample1) == """\
Adnan Wins
ARCNCD!
Adnan Wins
""".strip(), "sample 1"

# Minimum size and length-one palindrome.
case2 = """\
1
1 3
a
2 1 1
1 1 z
2 1 1
"""

assert run(case2) == """\
Adnan Wins
Adnan Wins
""".strip(), "minimum size"

# All equal characters remain palindromes after updates.
case3 = """\
1
5 4
aaaaa
2 1 5
1 3 a
2 2 4
2 1 4
"""

assert run(case3) == """\
Adnan Wins
Adnan Wins
Adnan Wins
""".strip(), "all equal"

# Boundary queries and a change that destroys the palindrome.
case4 = """\
1
5 4
abcba
2 1 5
2 2 4
1 1 z
2 1 5
"""

assert run(case4) == """\
Adnan Wins
Adnan Wins
ARCNCD!
""".strip(), "boundary and update"

# Maximum-size construction. The first query is a palindrome,
# then one endpoint changes and the full-range query must fail.
n = 100000
case5 = (
    "1\n"
    f"{n} 3\n"
    + "a" * n
    + "\n2 1 100000\n"
    + "1 1 b\n"
    + "2 1 100000\n"
)

assert run(case5) == """\
Adnan Wins
ARCNCD!
""".strip(), "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`Adnan Wins`,`ARCNCD!`,`Adnan Wins`| 官方更新和范围查询序列|
 |`N=1`, 单字符范围 |`Adnan Wins`两次| 最小尺寸和单例间隔 |
 |`aaaaa`| 三`Adnan Wins`答案 | 全部相等的值和不变的更新 |
 |`abcba`端点更新 |`Adnan Wins`,`Adnan Wins`,`ARCNCD!`| 全范围边界和更新传播|
 |`100000`相同的字符 |`Adnan Wins`,`ARCNCD!`| 最大尺寸和性能|

 ## 边缘情况

 单例区间在树中不需要特殊情况。 对于输入```
1
1 1
a
2 1 1
```内部区间为`[0,1)`，因此查询返回长度为 1 的段。 它的正向和反向哈希值都是`a`，程序打印`Adnan Wins`。 

通过用相同的值替换叶子并重建其祖先来处理再次分配当前字符的更新。 为了```
1
3 2
aba
1 2 b
2 1 3
```字符串仍然存在`aba`，因此全范围哈希值保持相等，输出为`Adnan Wins`。 该实现并不假设每次更新都会更改该值。 

触及右边界的查询会执行从包含索引到半开放索引的转换。 为了```
1
5 2
abcba
2 1 5
2 2 4
```第一个查询变成`[0,5)`第二个变成`[1,4)`。 他们的子串是`abcba`和`bcb`分别具有匹配的正向和反向哈希值。 两个输出都是`Adnan Wins`。 

具有对称字符频率的非回文仅根据计数捕获方法。 例如，```
1
4 1
aabb
2 1 4
```产生`ARCNCD!`。 前向序列为`aabb`，而相反的是`bbaa`。 线段树存储这两个不同的哈希值，因此即使频率不同，它也会拒绝该范围`a`和`b`是相同的。 

全字符串更新情况还检查更改是否一直传播到根。 开始于`abcba`，将位置 1 更改为`z`产生`zbcba`。 查询结束`[1,5]`然后比较`zbcba`反对`abcbz`，它们是不同的，所以答案是`ARCNCD!`。 这证实了更新路径正确地重建了其存储的子字符串包含更改的位置的每个祖先。
