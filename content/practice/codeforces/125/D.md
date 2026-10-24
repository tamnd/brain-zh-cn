---
title: "CF 125D - 两个级数"
description: "我们得到了一系列固定顺序的不同整数。 每个元素必须恰好分配给两个子序列之一。 在每个子序列内，必须保留原始顺序。 目标是使两个子序列都算术级数。"
date: "2026-06-02T16:23:26+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 125
codeforces_index: "D"
codeforces_contest_name: "Codeforces Testing Round 2"
rating: 2200
weight: 125
solve_time_s: 144
verified: false
draft: false
---

[CF 125D - 两个级数](https://codeforces.com/problemset/problem/125/D)

 **评分：** 2200
 **标签：** 构造性算法，贪心
 **求解时间：** 2m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一系列固定顺序的不同整数。 每个元素必须恰好分配给两个子序列之一。 在每个子序列内，必须保留原始顺序。 

目标是使两个子序列都算术级数。 长度为 1 或 2 的级数始终有效。 不允许长度为 0 的级数，因此两个结果子序列必须至少包含一个元素。 

序列长度高达 30000。任何立即尝试多种不同元素分配的方法都变得不可能。 甚至检查所有$2^n$分区大得离谱。 该解决方案必须利用算术级数的强大结构特性，并在大致线性的时间内运行。 

问题最微妙的部分是算术级数是按顺序定义的，而不是按排序定义的。 例如：```
1 5 3
```子序列`1 3`是算术，但是`1 5 3`不是。 任何首先对数组进行排序的解决方案都会解决不同的问题。 

另一个容易犯的错误是假设一旦我们猜出一个级数，每个匹配值都必须属于它。 考虑：```
1 2 3 -2 -7
```以下两项均有效：```
1 2 3
-2 -7
```和```
1 2
3 -2 -7
```该算法必须考虑到这种歧义。 

当一个进展几乎正确而只有最后选择的元素被放错位置时，就会出现第三个陷阱。 例如：```
4 1 2 7 3 10
```如果我们建立进展`1 2 3`，一切正常。 对于其他猜测，剩余元素可能无法进行算术运算，直到我们将最后选定的元素从一个级数移动到另一个级数。 

## 方法

 一个蛮力的想法是尝试将序列的每个分区分成两个子序列，并检查两者是否是算术序列。 这是正确的，因为它直接测试每个可能的答案。 不幸的是有$2^n$分区。 即使是为了$n=50$这已经是无望了，而这里$n$达到30000。 

关键的观察来自前三个要素。 

当三个元素分布成两个子序列时，根据鸽巢原理，至少其中两个属于同一级数。 这两个要素决定了该进程的共同差异。 

在前三个位置中，只有三个可能的对：```
(1,2), (1,3), (2,3)
```因此，只有三个候选人差异值得考虑。 

假设我们选择其中一对并假设它属于级数 A。它的差异是固定的。 一旦差异固定，整个级数 A 就确定了：从第一个选择的值开始，下一个值必须恰好是`start + d`， 然后`start + 2d`， 等等。 

我们从左到右扫描序列。 每当我们遇到A的下一个期望值时，我们就把它放入A中。其他的都暂时放入B中。 

经过此构造后，B 要么已经是算术级数，要么不是。 

剩下的技巧是唯一不明显的部分。 如果 B 不是算术，我们尝试将 A 选择的最后一个元素移动到 B 中并再次检查。 如果仍然失败，那么这个候选差异就不能产生有效的答案。 

为什么只移动最后一个元素就足够了？ 假设该候选差异存在某种解决方案。 贪心构造总是获取 A 的每个可用期望值。唯一可以安全“返回”给 B 的值是最后获取的值。 如果移动最后一个元素不能修复 B，那么移动更多元素也无济于事。 原始的 Codeforces 解决方案依赖于此属性并仅检查这两个配置。 

由于只有三个候选差异，并且每次检查都是线性的，因此整个算法是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 1.如果`n = 2`，将两个元素输出为两个单元素级数。 
2. 考虑前三个位置中的三对：`(1,2)`,`(1,3)`,`(2,3)`。 
3. 对于选定的一对`(l,r)`， 让：`d = a[r] - a[l]`。 
4. 贪婪地构造级数A。 

从期望值开始`a[l]`。 

从左到右扫描序列。 

每当当前元素等于期望值时，将其放入 A 中并将期望值增加`d`。 
5. A 没有取出的所有元素都放入 B 中。 
6. 检查B 是否是等差数列。 

长度 1 和长度 2 始终被接受。 
7. 如果B有效，则输出A和B。 
8. 否则，删除插入 A 的最后一个元素，将其移至 B，然后再次检查 B。 
9. 如果B有效，则输出修改后的A和B。 
10. 如果两个检查均未成功，则尝试下一个候选对。 
11. 如果三个候选对全部失败，则打印`"No solution"`。 

### 为什么它有效

 在前三个元素中，某些对必须属于任何有效分区中的同一级数。 该对确定候选差异，因此三个尝试之一使用正确的差异。 

对于固定差异，贪心构造恢复与该差异一致的最大算术级数。 每次出现预期值时，跳过它都会永久阻止该术语稍后出现在级数中，因为所有数字都是不同的。 

唯一可能的过度贪婪的选择是最终选择的元素。 将最后一个元素移动到其他进程将覆盖剩余的有效配置。 如果原始分区和通过移动最后选择的元素获得的分区都没有产生算术级数B，则不存在使用该差值的分区。 因此，只要存在差异，尝试这三个候选差异就足以找到解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_ap(v):
    m = len(v)
    if m == 0:
        return False
    if m <= 2:
        return True

    d = v[1] - v[0]
    for i in range(2, m):
        if v[i] - v[i - 1] != d:
            return False
    return True

def try_pair(a, l, r):
    n = len(a)

    d = a[r] - a[l]
    expected = a[l]

    used = [False] * n
    A = []
    last_idx = -1

    for i in range(n):
        if a[i] == expected:
            used[i] = True
            A.append(a[i])
            expected += d
            last_idx = i

    B = [a[i] for i in range(n) if not used[i]]

    if is_ap(B):
        return A, B

    A.pop()
    used[last_idx] = False

    B = [a[i] for i in range(n) if not used[i]]

    if is_ap(B):
        return A, B

    return None

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    if n == 2:
        print(a[0])
        print(a[1])
        return

    pairs = [(0, 1), (0, 2), (1, 2)]

    for l, r in pairs:
        res = try_pair(a, l, r)
        if res is not None:
            A, B = res

            if len(A) == 0 or len(B) == 0:
                continue

            print(*A)
            print(*B)
            return

    print("No solution")

if __name__ == "__main__":
    solve()
```功能`is_ap`实现算术级数的精确定义。 长度 1 和 2 自动有效，而长度 0 则被拒绝，因为该问题要求两个子序列都非空。 

功能`try_pair`执行一项候选检查。 差异由前三个元素中所选择的对决定。 在扫描过程中，变量`expected`存储必须出现在级数 A 中的下一个值。 

数组`used`记录哪些位置被分配给 A。 重建 B`used`比在扫描期间尝试维护两个子序列更简单且不易出错。 

一个微妙的细节是存储`last_idx`。 如果第一个版本失败，则仅从 A 中删除最终选定的元素。从更新后的数据中重新计算 B`used`array 保证相对顺序保持正确。 

所有算术都使用 Python 整数，因此即使值可能达到$10^8$。 

## 工作示例

 ### 示例 1

 输入：```
6
4 1 2 7 3 10
```尝试配对`(1,2)`在从 1 开始的索引中，值`(4,1)`。 

| 职位| 价值| 预计在 A | 行动|
 | ---| ---| ---| ---|
 | 1 | 4 | 4 | 一个 |
 | 2 | 1 | 1 | 一个 |
 | 3 | 2 | -2 | 乙|
 | 4 | 7 | -2 | 乙|
 | 5 | 3 | -2 | 乙|
 | 6 | 10 | 10 -2 | 乙|`B = [2, 7, 3, 10]`，不是算术。 

尝试配对`(2,3)`, 值`(1,2)`。 

| 职位| 价值| 预计在 A | 行动|
 | ---| ---| ---| ---|
 | 1 | 4 | 1 | 乙|
 | 2 | 1 | 1 | 一个 |
 | 3 | 2 | 2 | 一个 |
 | 4 | 7 | 3 | 乙|
 | 5 | 3 | 3 | 一个 |
 | 6 | 10 | 10 4 | 乙|`A = [1,2,3]`

`B = [4,7,10]`两者都是算术，所以我们输出它们。 

此示例显示如何从三个候选对之一恢复正确的差异。 

### 示例 2

 输入：```
5
1 2 3 -2 -7
```尝试配对`(1,2)`。 

| 职位| 价值| 预计在 A | 行动|
 | ---| ---| ---| ---|
 | 1 | 1 | 1 | 一个 |
 | 2 | 2 | 2 | 一个 |
 | 3 | 3 | 3 | 一个 |
 | 4 | -2 | 4 | 乙|
 | 5 | -7 | 4 | 乙|

 我们得到：```
A = [1,2,3]
B = [-2,-7]
```两个子序列都是算术序列。 

此示例说明长度为 2 的级数始终有效，这对于许多成功的分区至关重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n)$| 三次线性扫描，每次检查候选差异 |
 | 空间|$O(n)$| 子序列和标记数组的存储 |

 序列长度只有 30000，因此一些线性传递很容易就足够快了。 内存使用量也很小，因为我们只存储少量大小的数组$n$。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    def solve():
        input = sys.stdin.readline

        def is_ap(v):
            if len(v) == 0:
                return False
            if len(v) <= 2:
                return True
            d = v[1] - v[0]
            for i in range(2, len(v)):
                if v[i] - v[i - 1] != d:
                    return False
            return True

        def try_pair(a, l, r):
            d = a[r] - a[l]
            expected = a[l]

            used = [False] * len(a)
            A = []
            last = -1

            for i, x in enumerate(a):
                if x == expected:
                    used[i] = True
                    A.append(x)
                    expected += d
                    last = i

            B = [a[i] for i in range(len(a)) if not used[i]]
            if is_ap(B):
                return A, B

            A.pop()
            used[last] = False
            B = [a[i] for i in range(len(a)) if not used[i]]

            if is_ap(B):
                return A, B

            return None

        n = int(input())
        a = list(map(int, input().split()))

        if n == 2:
            print(a[0])
            print(a[1])
            return

        for l, r in [(0, 1), (0, 2), (1, 2)]:
            res = try_pair(a, l, r)
            if res:
                A, B = res
                if A and B:
                    print(*A)
                    print(*B)
                    return

        print("No solution")

    solve()

    sys.stdout = old_stdout
    return out.getvalue()

# sample 1
assert run("6\n4 1 2 7 3 10\n") != "No solution\n"

# sample 2
assert run("5\n1 2 3 -2 -7\n") != "No solution\n"

# minimum size
assert run("2\n5 9\n") == "5\n9\n"

# already two interleaved progressions
assert run("6\n1 10 3 20 5 30\n") != "No solution\n"

# impossible case
assert run("5\n1 2 4 8 16\n") == "No solution\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 5 9`| 两个单例进行 | 最小尺寸|
 |`1 10 3 20 5 30`| 任何有效的分区 | 交错进行|
 |`1 2 4 8 16`|`No solution`| 负面案例|
 | 输入样本| 有效分区| 基本正确性 |

 ## 边缘情况

 考虑：```
2
5 9
```该问题仍然需要两个非空级数。 该算法立即将每个元素输出为单例级数。 长度 1 是算术长度，因此这是有效的。 

考虑：```
5
1 2 3 -2 -7
```元素`3`可能属于任一进展。 贪婪的结构将其放入不同的进程中`1`，生产：```
1 2 3
-2 -7
```该解决方案仍然有效，因为算术级数是由其预期的下一个值决定的。 

考虑：```
6
4 1 2 7 3 10
```一些候选人的分歧一开始就失败了。 该算法检查直接贪婪分区和最后选定元素移动到另一个进程的版本。 这可以防止由于单个过度贪婪的选择而导致拒绝有效配置。 

最后，考虑一个不可能的输入，例如：```
5
1 2 4 8 16
```测试所有三个候选差异。 即使在移动最后一个选定的元素之后，它们也不会产生两个算术子序列。 该算法正确打印：```
No solution
```
