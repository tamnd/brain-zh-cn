---
title: "CF 1843E - 跟踪段"
description: "我们从一个长度为 n 且完全用零填充的数组开始。 有m个段。 当一个段内 1 的数量严格大于同一段内 0 的数量时，该段被认为是美丽的。"
date: "2026-06-09T06:09:07+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1843
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 881 (Div. 3)"
rating: 1600
weight: 1843
solve_time_s: 107
verified: true
draft: false
---

[CF 1843E - 跟踪段](https://codeforces.com/problemset/problem/1843/E)

 **评分：** 1600
 **标签：** 二分查找、暴力破解、数据结构、两个指针
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个长度的数组开始`n`完全用零填充。 

有`m`段。 当一个段内 1 的数量严格大于同一段内 0 的数量时，该段被认为是美丽的。 对于一段长度`len`，这个条件等价于：$$\text{ones} > \frac{\text{len}}{2}$$我们还得到了一个序列`q`更新。 这`i`-th 更新转动位置`x_i`进入`1`。 职位是不同的，所以一旦职位变成`1`，它保持`1`。 

任务是找到最早的更新编号，之后至少有一个给定的片段变得漂亮。 如果即使在应用所有更新后也没有片段是漂亮的，我们输出`-1`。 

这些限制立即表明，模拟每次更新并从头开始重新检查每个段的成本太高。 在所有测试用例中，总和`n`至多是`10^5`，但单个测试用例仍可能包含最多`10^5`段和`10^5`更新。 任何执行与以下成比例的功的解决方案`m × q`远远超出了两秒所能容纳的范围。 

一个微妙的观察是，更新只会添加更多内容。 一旦一个片段变得美丽，它就永远不会停止美丽。 这种单调行为是解决方案的关键。 

考虑一个小例子：```
n = 5
segment = [1,5]
updates = 5,3,1,2,4
```第一次更新后有一个`1`，第二个之后有两个，第三个之后有三个。 段长是五，所以三个就足够让它漂亮了。 答案是`3`。 

另一个容易犯的错误是忘记条件是严格更大的。```
segment length = 4
ones = 2
zeros = 2
```这并不美丽。 粗心的实现使用`>=`而不是`>`会错误地接受它。 

当段由单个位置组成时，会出现不同的边缘情况。```
segment = [3,3]
```瞬间位置`3`变成`1`，该段包含一一和零零，所以它立即就很漂亮。 答案可能是`1`。 

最后，有些实例永远不会产生漂亮的片段。```
n = 4
segments = [1,1], [4,4]
updates = 2,3
```这两个部分都没有被触及，所以正确的答案是`-1`。 

## 方法

 直接模拟很简单。 每次更新后，将新位置标记为`1`，然后检查每个段。 对于每个段，计算它当前包含多少个，并检查该计数是否超过段长度的一半。 

暴力版本是正确的，因为它从字面上实现了定义。 问题是成本。 和`q`更新和`m`段，即使对段内的计数是恒定时间，我们仍然会执行`m × q`检查。 在最坏的情况下，这大约变成`10^10`的操作，这是完全不可行的。 

转折点来自于观察到“某些片段是美丽的”属性是单调的。 

如果在第一个之后`k`更新某些片段是美丽的，然后在任何大量更新之后它仍然保持美丽，因为更新只会添加片段。 这意味着答案是单调谓词变为真的第一个位置。 

每当问题要求出现单调条件的最早点时，二分查找就成为自然的候选者。 

假设我们猜测一个值`mid`。 我们问：

 > 应用第一个之后`mid`更新了，还有美丽的片段吗？ 

为了有效地回答这个问题，我们构建了一个数组，标记第一个位置中哪些位置已被激活`mid`更新。 然后，前缀和允许我们在恒定时间内计算任何段内的 1 的数量。 

对于一个段`[l,r]`:$$\text{ones} = pref[r] - pref[l-1]$$该片段在以下情况下很漂亮：$$\text{ones} > (r-l+1) - \text{ones}$$检查所有段成本`O(m)`，并构建前缀和成本`O(n)`。 

因此，可以对谓词进行评估`O(n+m)`时间。 将其与二分搜索相结合`q`更新给出了一个可接受的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(qm) 或更差 | O(n) | 太慢了 |
 | 最佳 | O((n + m) log q) | O((n + m) log q) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有段和所有更新位置。 
2. 定义函数`check(k)`决定应用第一个片段后某个片段是否漂亮`k`更新。 
3. 内部`check(k)`，创建一个长度的数组`n`用零初始化。 
4.标记第一个`k`更新后的职位为`1`。 
5. 在此二进制数组上构建前缀和数组。 
6. 对于每个细分市场`[l,r]`，使用前缀和计算其中的 1 的数量。 
7.让`length = r - l + 1`。 如果 1 的数量严格大于`length / 2`，立即返回`True`。 
8. 如果没有段满足条件，则返回`False`。 
9. 在二分查找之前，评估`check(q)`。 如果为 false，则任何片段都不会变得美丽，因此输出`-1`。 
10. 否则对答案进行二分查找。 维护谓词为真的最小更新计数。 
11.输出最左边的有效更新号。 

### 为什么它有效

 检查的谓词`check(k)`是：

 > 在第一个片段之后至少有一个片段很漂亮`k`更新。 

应用更多更新只会增加每个段中的更新数量。 美丽的片段以后永远不会变得不美丽。 因此，谓词是单调的：一旦它变为真，它就永远为真。 

前缀和计算每个段内激活位置的确切数量，因此`check(k)`当问题条件满足后返回 true`k`更新。 

对单调谓词的二分查找总是找到谓词为真的最小索引。 该索引正是第一次更新，之后某些片段变得美丽。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, m = map(int, input().split())

        segments = []
        for _ in range(m):
            l, r = map(int, input().split())
            segments.append((l, r))

        q = int(input())
        queries = [int(input()) for _ in range(q)]

        def check(k):
            arr = [0] * (n + 1)

            for i in range(k):
                arr[queries[i]] = 1

            pref = [0] * (n + 1)
            for i in range(1, n + 1):
                pref[i] = pref[i - 1] + arr[i]

            for l, r in segments:
                ones = pref[r] - pref[l - 1]
                length = r - l + 1

                if ones * 2 > length:
                    return True

            return False

        if not check(q):
            print(-1)
            continue

        lo, hi = 1, q
        ans = q

        while lo <= hi:
            mid = (lo + hi) // 2

            if check(mid):
                ans = mid
                hi = mid - 1
            else:
                lo = mid + 1

        print(ans)

if __name__ == "__main__":
    solve()
```解决方案围绕`check`功能。 它在第一个之后重建数组状态`k`更新，然后使用前缀和数组在恒定时间内回答段计数查询。 

条件```
ones * 2 > length
```相当于检查1的数量是否超过0的数量。 使用乘法可以避免整数除法的任何问题。 

二分查找查找第一个值`k`为此`check(k)`返回真。 由于谓词是单调的，因此直接应用标准的最左真二分搜索。 

一个容易出错的实现细节是索引。 这些段是 1 索引的，因此前缀和数组也构建为 1 索引的。 这使得公式```
pref[r] - pref[l - 1]
```自然地工作。 

另一个微妙的点是检查`check(q)`在二分查找之前。 如果即使在所有更新之后谓词仍为假，则二分搜索将没有有效答案。 单独处理这种情况可以使搜索逻辑变得简单。 

## 工作示例

 ### 示例 1

 输入：```
n = 5
segments = [1,2], [4,5], [1,5], [1,3], [2,4]
updates = 5,3,1,2,4
```二分搜索评估：

 | k | 活跃职位| 美丽的片段存在吗？ |
 | --- | --- | --- |
 | 3 | {1,3,5} | 是的 |
 | 1 | {5} | 没有 |
 | 2 | {3,5} | 没有 |

 搜索首先发现`k=3`作品。 然后它验证两者都不是`1`也不`2`作品。 最小有效值为`3`。 

这个例子展示了谓词的单调性质。 一次`k=3`变为有效时，所有较大的值仍然有效。 

### 示例 2

 输入：```
n = 4
segments = [1,1], [4,4]
updates = 2,3
```状态演变：

 | k | 活跃职位| 段 [1,1] | 段[4,4] | 存在吗？ |
 | --- | --- | --- | --- | --- |
 | 1 | {2} | 0 个 | 0 个 | 没有 |
 | 2 | {2,3} | 0 个 | 0 个 | 没有 |

 即使在所有更新之后，两个受监视的位置都不会变为`1`。 

初步的`check(q)`失败了，所以答案是`-1`。 

此示例说明了算法在开始二分搜索之前执行完整检查测试的原因。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log q) | O((n + m) log q) | 每个谓词求值都会扫描数组和所有段，二分搜索执行 O(log q) 求值 |
 | 空间| O(n) | 激活状态和前缀和的数组 |

 总和为`n`跨测试用例最多`10^5`。 每个二分搜索迭代执行线性工作`n + m`，最多有大约 17 次迭代，因为`q ≤ 10^5`。 这完全符合时间限制并且仅使用线性存储器。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from io import StringIO

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = StringIO(inp)
    sys.stdout = StringIO()

    def solve():
        input = sys.stdin.readline

        t = int(input())

        for _ in range(t):
            n, m = map(int, input().split())

            segments = [tuple(map(int, input().split())) for _ in range(m)]

            q = int(input())
            queries = [int(input()) for _ in range(q)]

            def check(k):
                arr = [0] * (n + 1)

                for i in range(k):
                    arr[queries[i]] = 1

                pref = [0] * (n + 1)

                for i in range(1, n + 1):
                    pref[i] = pref[i - 1] + arr[i]

                for l, r in segments:
                    ones = pref[r] - pref[l - 1]
                    if ones * 2 > (r - l + 1):
                        return True

                return False

            if not check(q):
                print(-1)
                continue

            lo, hi = 1, q
            ans = q

            while lo <= hi:
                mid = (lo + hi) // 2

                if check(mid):
                    ans = mid
                    hi = mid - 1
                else:
                    lo = mid + 1

            print(ans)

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# provided sample
assert run(
"""6
5 5
1 2
4 5
1 5
1 3
2 4
5
5
3
1
2
4
4 2
1 1
4 4
2
2
3
5 2
1 5
1 5
4
2
1
3
4
5 2
1 5
1 3
5
4
1
2
3
5
5 5
1 5
1 5
1 5
1 5
1 4
3
1
4
3
3 2
2 2
1 3
3
2
3
1
"""
) == """3
-1
3
3
3
1
"""

# minimum size
assert run(
"""1
1 1
1 1
1
1
"""
) == """1
"""

# never becomes beautiful
assert run(
"""1
4 2
1 1
4 4
2
2
3
"""
) == """-1
"""

# strict inequality check
assert run(
"""1
4 1
1 4
2
1
2
"""
) == """-1
"""

# answer occurs at final update
assert run(
"""1
3 1
1 3
3
1
2
3
"""
) == """2
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元件段 | 1 | 最小约束 |
 | 未触及的监控位置 | -1 | 从未出现过美丽的片段|
 | 长度为 4，恰好有 2 个 | -1 | 严格大于，而不是大于或等于 |
 | 段[1,3]逐渐激活| 2 | 正确找到最早的有效更新 |

 ## 边缘情况

 考虑长度为偶数的线段。```
1
4 1
1 4
2
1
2
```两次更新后，该段包含两个 1 和两个 0。 该算法计算：```
ones = 2
length = 4
ones * 2 = 4
```自从`4 > 4`是假的，段子不漂亮。 输出是`-1`。 这正确地处理了严格的不平等要求。 

考虑一个单位置段。```
1
1 1
1 1
1
1
```为了`k = 1`，该段包含一个一和零个零。 支票变成：```
1 * 2 > 1
```这是正确的，所以二分查找返回`1`。 

考虑没有段受到影响的情况。```
1
4 2
1 1
4 4
2
2
3
```即使在所有更新之后，两个跟踪的段都包含零。 初步通话`check(q)`返回 false，算法立即输出`-1`。 

最后，考虑重复的大段：```
n = 5
segments = [1,5], [1,5], [1,5]
updates = 2,1,3,4
```该算法独立检查每个段。 重复的段不会改变正确性，因为每次检查都使用相同的前缀和查询。 一旦一个重复项变得漂亮，谓词就会返回 true。
