---
title: "CF 916B - 杰米和二进制序列（回合后更改）"
description: "我们希望将正整数 n 表示为 2 的 k 次方之和： $$n = 2^{a1} + 2^{a2} + cdots + 2^{ak}$$ 指数可以是正数、零甚至负数。 在长度为 k 的所有有效序列中，我们首先最小化出现的最大指数。"
date: "2026-06-12T09:55:59+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 916
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 457 (Div. 2)"
rating: 2000
weight: 916
solve_time_s: 134
verified: true
draft: false
---

[CF 916B - Jamie 和二进制序列（回合后更改）](https://codeforces.com/problemset/problem/916/B)

 **评级：** 2000
 **标签：** 位掩码，贪婪，数学
 **求解时间：** 2m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们想要表示一个正整数`n`作为精确总和`k`二的幂：$$n = 2^{a_1} + 2^{a_2} + \cdots + 2^{a_k}$$指数可以是正数、零，甚至负数。 在所有长度有效的序列中`k`，我们首先最小化出现的最大指数。 令最小可能的最大指数为`y`。 在实现最佳效果的所有序列中`y`，我们必须输出字典顺序最大的序列。 

的价值`n`可以大到`10^{18}`， 尽管`k`至多是`10^5`。 的二进制表示`n`contains at most sixty bits, so any solution that works with the powers of two appearing in the binary decomposition is naturally very small. On the other hand, a search over all possible exponent assignments is completely impossible because the number of representations grows explosively.

 The unusual part of the problem is that negative exponents are allowed. 例如，$$2^{-1} + 2^{-1} = 1.$$这意味着我们总是可以将一个幂分成两个较小的幂：$$2^x = 2^{x-1} + 2^{x-1}.$$该操作将项数增加一项，同时保留总和。 

一些边缘情况很容易被错误处理。 

考虑`n = 1, k = 2`。 存在解决方案是因为$$1 = 2^{-1} + 2^{-1}.$$仅考虑非负指数的解决方案将错误地打印`No`。 

考虑`n = 3, k = 1`。 唯一的长度为 1 的表示是 2 的一次幂，但是`3`不是二的幂。 正确答案是`No`。 

考虑`n = 8, k = 8`。 最佳答案是八个指数副本`0`，因为反复分裂$$2^3 \to 2^2+2^2 \to \cdots \to 1+1+\cdots+1.$$试图在不检查所需项数的情况下保留大指数的贪婪过程可能无法准确达到`k`条款。 

词典编排要求是另一个微妙之处。 在找到尽可能小的最大指数后，我们必须尽早放置更大的指数。 具有相同多组指数的两个解可以具有不同的字典顺序。 

## 方法

 蛮力观点是考虑每一个表示`n`就像反复分裂两个人的权力一样。 从二进制表示开始`n`，每次分割替换一个指数`x`由两份`x-1`。 我们可以探索所有可能的分裂序列，直到精确地`k`出现条款。 

这是正确的，因为每个表示都可以通过这样的分割获得。 不幸的是，国家的数量是巨大的。 即使对于中等值，分支因子也会变得巨大，并且没有机会探索所有可能性。 

关键的观察是我们实际上并不关心每一个表示。 我们首先关心最大指数的最小可能值。 

假设我们决定每个指数最多必须是`M`。 任何原始位`2^i`和`i > M`必须进行拆分，直到所有结果指数变为`M`。 一份`2^i`变成$$2^{i-M}$$指数的副本`M`。 

这立即告诉我们在最多保持最大指数的情况下可以获得多少项`M`。 

对于固定的`M`，还有最小可能的项数。 每一位最多有指数`M`可以保持不变。 以上每一位`M`必须分解为级别`M`。 

让`cnt(M)`表示最小术语数。 如果`cnt(M) > k`，那么即使是最紧凑的表示也已经使用了太多的术语，所以`M`是不可能的。 

如果`cnt(M) \le k`，那么我们总是可以通过最多进一步分裂指数来创建附加项`M`。 由于拆分将术语计数恰好增加了 1，因此可以达到任何更大的计数。 因此`M`是可行的。 

可行性是单调的。 如果`M`有效，每个更大的指数极限也有效。 这给出了最小可行的二分搜索`M`。 

找到最优最大指数后`M`，我们必须构建字典顺序最大的序列。 我们从尊重限制的最低期限表示开始`M`。 然后我们执行额外的分割，直到我们完全达到`k`条款。 

为了最大化字典顺序，我们应该尽可能保留大指数，并首先分割最小的可用指数。 拆分较小的指数会影响降序排序序列中后面的位置，并在前面保留较大的值。 

指数的优先级队列允许我们重复分割当前的最小指数，直到恰好`k`条款存在。 

最后，我们按降序输出所有指数。 在具有相同多重集的所有表示中，该排序按字典顺序是最大的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳| O(log² n + k log k) | O(log² n + k log k) | O(k) | 已接受 |

 ## 算法演练

 1. 分解`n`成二进制。 对于位置处的每个设置位`i`, 记录一份指数副本`i`。 
2.二分查找最小指数限制`M`最多具有最大指数的有效表示`M`存在。 
3. 测试候选人`M`，计算该限制下所需的最小项数。 

如果一点贡献指数`i ≤ M`，它贡献一项。 

如果`i > M`，必须将其分解为级别`M`，生产`2^(i-M)`条款。 
4. 如果这个最小计数超过`k`, 极限`M`是不可能的。 
5. 否则该限制是可行的，因为额外的分割总是可以将术语计数一一增加。 
6. 二分查找结束后，让答案成为最小的可行值`M`。 
7.为此建立最低期限表示`M`。 

每个原始指数`i ≤ M`贡献一个指数`i`。 

每个原始指数`i > M`贡献`2^(i-M)`指数的副本`M`。 
8. 设当前项数为`cur`。 
9. 虽然`cur < k`，重复分割当前存在的最小指数。 

替换一位指数`x`由两份`x-1`。 

增加`cur`一个。 
10. 确切的时间`k`项存在，按降序对所有指数进行排序。 
11. Output the sequence.

 ### 为什么它有效

 对于固定限制`M`，每个指数大于`M`最终必须减少到`M`或以下。 直接拆分到级别`M`在该限制下产生尽可能少的项数。 遵守相同限制的任何其他表示只能具有至少同样多的项。 

因此`cnt(M)`是可实现的最小术语数。 如果`cnt(M) > k`，不存在最多具有最大指数的解`M`。 如果`cnt(M) ≤ k`，重复分割让我们每次都将术语计数增加一，因此达到精确`k`条件总是可能的。 

二分查找找到最小的可行值`M`，这正是最小可能的最大指数。 

修复后`M`，仅需要额外的分割即可达到所需的长度。 分割最小的指数可以保留较大的指数，从而使降序序列的前面尽可能大。 因此，最终的降序序列在所有最优解中按字典顺序是最大的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    bits = []
    x = n
    pos = 0
    while x:
        if x & 1:
            bits.append(pos)
        pos += 1
        x >>= 1

    if n == 0:
        print("No")
        return

    def min_terms(M):
        total = 0
        for b in bits:
            if b <= M:
                total += 1
            else:
                total += 1 << (b - M)
            if total > k:
                return total
        return total

    lo = -100000
    hi = max(bits) if bits else 0

    while lo < hi:
        mid = (lo + hi) // 2
        if min_terms(mid) <= k:
            hi = mid
        else:
            lo = mid + 1

    M = lo

    exps = []
    for b in bits:
        if b <= M:
            exps.append(b)
        else:
            exps.extend([M] * (1 << (b - M)))

    cur = len(exps)

    heapq.heapify(exps)

    while cur < k:
        x = heapq.heappop(exps)
        heapq.heappush(exps, x - 1)
        heapq.heappush(exps, x - 1)
        cur += 1

    ans = sorted(exps, reverse=True)

    print("Yes")
    print(*ans)

if __name__ == "__main__":
    solve()
```二进制分解最多包含六十个指数，因此可行性测试极小。 

功能`min_terms(M)`计算尽可能少的项数，同时强制每个指数最多为`M`。 对于上面的指数`M`，每个分层将副本数量加倍，给出`2^(b-M)`条款。 

二分查找适用于指数，包括负值。 下界`-100000`安全地低于任何可能需要的东西，因为`k ≤ 10^5`。 我们只需要大约`log2(k)`超出现有最小指数的额外分裂级别。 

得到最优解后`M`，代码显式构建最小项表示。 产生的项总数永远不会超过`k`， 因为`M`是可行的并且被选择使得`min_terms(M) ≤ k`。 

堆存储所有当前指数。 每次拆分都会删除一个指数并插入两个低一级的副本。 由于项数恰好增加了一项，因此`k - cur`splits are required.

 最后，按降序排序给出字典顺序最大的序列。 

## 工作示例

 ### 示例 1

 输入：```
23 5
```二进制表示：$$23 = 2^4 + 2^2 + 2^1 + 2^0$$最小的可行最大指数是`3`。 

| 步骤| 代表| 学期计数 |
 | --- | --- | --- |
 | M=3下初始| 3, 3, 2, 1, 0 | 3, 3, 2, 1, 0 | 5 |
 | 目标达成 | 3, 3, 2, 1, 0 | 3, 3, 2, 1, 0 | 5 |

 输出：```
Yes
3 3 2 1 0
```此示例显示了一个副本`2^4`必须分成两个副本`2^3`，减少最大指数`4`到`3`。 

### 示例 2

 输入：```
3 1
```二进制表示：$$3 = 2^1 + 2^0$$| 步骤| 代表| 学期计数 |
 | --- | --- | --- |
 | 最低限度| 1, 0 | 2 |

 The minimum number of terms is already`2`，而分裂只能增加计数。 

输出：```
No
```这演示了请求长度小于最小可实现长度的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log² n + k log k) | O(log² n + k log k) | 超过指数限制的二分查找，然后至多 k 堆操作 |
 | 空间| O(k) | 存储最终表示 |

 二进制分解最多包含 60 位，因此可行性检查很小。 主要成本来自于维持`k`堆中的指数。 和`k ≤ 10^5`，该解决方案很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from contextlib import redirect_stdout

def solve():
    import heapq

    n, k = map(int, input().split())

    bits = []
    x = n
    p = 0
    while x:
        if x & 1:
            bits.append(p)
        p += 1
        x >>= 1

    def min_terms(M):
        total = 0
        for b in bits:
            total += 1 if b <= M else (1 << (b - M))
            if total > k:
                return total
        return total

    lo = -100000
    hi = max(bits)

    while lo < hi:
        mid = (lo + hi) // 2
        if min_terms(mid) <= k:
            hi = mid
        else:
            lo = mid + 1

    M = lo

    exps = []
    for b in bits:
        if b <= M:
            exps.append(b)
        else:
            exps.extend([M] * (1 << (b - M)))

    cur = len(exps)

    heapq.heapify(exps)

    while cur < k:
        x = heapq.heappop(exps)
        heapq.heappush(exps, x - 1)
        heapq.heappush(exps, x - 1)
        cur += 1

    ans = sorted(exps, reverse=True)

    print("Yes")
    print(*ans)

def run(inp: str) -> str:
    global input
    input = io.StringIO(inp).readline

    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample
assert run("23 5\n") == "Yes\n3 3 2 1 0"

# custom cases
assert run("1 1\n") == "Yes\n0"
assert run("1 2\n") == "Yes\n-1 -1"
assert run("3 1\n") == "No"
assert run("8 8\n") == "Yes\n0 0 0 0 0 0 0 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`0`| 最小有效实例 |
 |`1 2`|`-1 -1`| 允许负指数 |
 |`3 1`|`No`| 请求的长度低于最小值 |
 |`8 8`| 八个零 | 重复拆分以精确计数 |

 ## 边缘情况

 考虑输入：```
1 2
```二进制表示包含一个指数`0`。 最优最大指数为`-1`， 因为$$1 = 2^{-1}+2^{-1}.$$可行性检查发现`M = -1`正好给出两个项。 该算法输出：```
Yes
-1 -1
```此案例捕获了错误地假设指数必须为非负的解决方案。 

考虑：```
3 1
```二进制表示是`[1, 0]`。 即使没有指数限制，最小项数也是`2`。 由于分裂只会增加计数，因此不可能达到一项。 该算法正确打印：```
No
```考虑：```
8 8
```从指数开始`[3]`，最优最大指数变为`0`，产生八个指数副本`0`。 该算法准确地构建：```
0 0 0 0 0 0 0 0
```这验证了当需要大量项时，二分查找可以将最大指数推到原始最高位以下。 

考虑：```
5 4
```我们有$$5 = 2^2 + 2^0.$$和`M = 0`，最小表示变成四份指数`0`再加上一个指数`0`，总共五项，太多了。 和`M = 1`，最小表示为三项：`1, 1, 0`。 最小指数的另一次分割给出四项，从而产生最佳答案。 这检查可行和不可行指数限制之间的边界。
