---
title: "CF 106439O - 最佳 GCD 分割"
description: "我们得到一个正整数数组。 分割位置将其分为左部分和右部分。 如果我们能够在最多更改一个数组元素后使两部分的最大公约数相等，则认为分割是好的。"
date: "2026-06-25T09:33:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106439
codeforces_index: "O"
codeforces_contest_name: "Insomnia-26"
rating: 0
weight: 106439
solve_time_s: 44
verified: true
draft: false
---

[CF 106439O - 最佳 GCD 分割](https://codeforces.com/problemset/problem/106439/O)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组。 分割位置将其分为左部分和右部分。 如果我们能够在最多更改一个数组元素后使两部分的最大公约数相等，则认为分割是好的。 更改的元素可以位于数组中的任何位置，并且针对每个可能的拆分单独做出决定。 

对于每一次分割，问题并不是要求我们找到 GCD 的最终值。 我们只需要知道通过修改分割的一侧而另一侧保持不变是否可以达到某个共同值。 

数组长度可以达到$2 \cdot 10^5$所有测试用例。 这排除了通过扫描两侧来检查每个分割的情况，这将花费$O(n^2)$。 我们需要一个接近线性或$O(n \log n)$。 值本身可以大到$10^9$，因此基于整除性和 GCD 的运算必须是高效的。 

棘手的情况来自于允许进行一次修改这一事实。 当前 GCD 不同的分裂并不一定是坏的。 例如：```
Input:
1
2
6 10

Output:
1
```唯一的区别在于两个数字之间。 左GCD为6，右GCD为10。通过将第一个元素从6改为10，双方的GCD都是10，因此分割效果很好。 仅比较当前前缀和后缀 GCD 的解决方案将错误地拒绝它。 

另一种边缘情况是包含许多元素的一侧，其中只有一个元素阻止目标 GCD。```
Input:
1
3
6 10 15

Output:
2
```对于第一次分割，左侧有 GCD 6，右侧有 GCD 5。将 6 更改为 5，使双方都有 GCD 5。对于第二次分割，左侧有 GCD 2，右侧有 GCD 15，将 15 更改为 2 即可。 重要的观察结果是，如果除一个元素之外的所有元素都已支持所需的 GCD，则可以修复一侧。 

## 方法

 直接方法会尝试每次分割并计算一次修改是否可以使两个 GCD 相等。 对于拆分，我们可以计算当前的 GCD，然后尝试删除每个元素一次，看看修改后可能有哪些 GCD。 这是正确的，因为更改一个元素相当于决定所有其他元素必须已可被最终 GCD 整除。 然而，对每个分割执行此操作将需要重复扫描阵列的大部分。 在最坏的情况下，它会变成$O(n^2)$，这太慢了。 

关键的观察是，一个段可以被某个目标值整除$g$更改一个元素后，除了可能的一个元素之外的每个元素都必须已经可以被整除$g$。 我们不需要知道修改后的元素的确切新值，因为我们总是可以将其替换为$g$。 

所以对于左 GCD 的分割$L$和右GCD$R$，只有三种可能。 分割已经有效，如果$L = R$。 否则，我们可以更改左侧的一个元素，使其 GCD 变为$R$，或者改变右边的一个元素，使其 GCD 变为$L$。 这些检查简化为询问一个范围是否最多包含一个不能被给定值整除的数字。 

为了快速回答这些整除性查询，我们构建了一个线段树，其中每个节点都存储其区间的 GCD。 如果节点的 GCD 可以被目标值整除，则整个区间有效并且可以跳过。 否则，我们会下降，直到找到少数违反条件的元素。 由于我们一发现两个坏元素就停止，所以每个查询都很快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算每个前缀和每个后缀的 GCD。 该位置的前缀值$i$给出 split 左侧的当前 GCD$i$，后缀值给出了右侧当前的GCD。 
2. 构建一棵线段树，存储每个区间的GCD。 树可以让我们快速查找某个范围是否具有多个不能被给定目标整除的元素。 
3. 对于每个分割位置，令左 GCD 为$L$正确的 GCD 是$R$。 
4.如果$L = R$，立即计算此分割，因为不需要修改。 
5.否则检查左边部分是否可以改成GCD$R$。 当左侧部分至多有一个不能被整除的元素时，这是正确的$R$。 
6、如果失败，检查是否可以将右侧部分改为GCD$L$。 这与右侧的情况相同。 
7. 如果任一修改检查成功，则对拆分进行计数。 

该算法背后的不变量是一个线段可以被变换为具有GCD$g$当该段中最多有一个元素不能被整除时，进行一项修改$g$。 所有未更改的元素都必须对最终的 GCD 做出贡献，并且可以为一个修改的元素分配完成所需 GCD 的任何值。 线段树检查此条件而不访问每个元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build(node, left, right, arr, tree):
    if left == right:
        tree[node] = arr[left]
        return
    mid = (left + right) // 2
    build(node * 2, left, mid, arr, tree)
    build(node * 2 + 1, mid + 1, right, arr, tree)
    tree[node] = gcd(tree[node * 2], tree[node * 2 + 1])

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def count_bad(node, left, right, ql, qr, target, tree):
    if qr < left or right < ql:
        return 0
    if ql <= left and right <= qr and tree[node] % target == 0:
        return 0
    if left == right:
        return 1
    mid = (left + right) // 2
    result = count_bad(node * 2, left, mid, ql, qr, target, tree)
    if result > 1:
        return result
    result += count_bad(node * 2 + 1, mid + 1, right, ql, qr, target, tree)
    return result

def solve_case(arr):
    n = len(arr)

    pref = [0] * n
    suff = [0] * n

    for i in range(n):
        pref[i] = gcd(pref[i - 1], arr[i]) if i else arr[i]

    for i in range(n - 1, -1, -1):
        suff[i] = gcd(suff[i + 1], arr[i]) if i + 1 < n else arr[i]

    tree = [0] * (4 * n)
    build(1, 0, n - 1, arr, tree)

    ans = 0

    for i in range(n - 1):
        left_g = pref[i]
        right_g = suff[i + 1]

        if left_g == right_g:
            ans += 1
            continue

        if count_bad(1, 0, n - 1, 0, i, right_g, tree) <= 1:
            ans += 1
            continue

        if count_bad(1, 0, n - 1, i + 1, n - 1, left_g, tree) <= 1:
            ans += 1

    return ans

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))
        ans.append(str(solve_case(arr)))
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```前缀和后缀数组存储用作每个分割另一侧的自然目标的 GCD 值。 如果两个值已经匹配，则立即得到答案。 

线段树存储区间GCD。 在查询期间，当整个节点存储的 GCD 可被目标整除时，可以丢弃整个节点，因为该区间中的每个元素也必须可被目标整除。 当一个节点无法被丢弃时，继续向下搜索，直到找到打破整除条件的元素。 

查询在发现两个坏元素后停止，因为算法只需要知道计数是零、一还是至少二。 这避免了不必要的遍历并将复杂性控制在一定范围内。 

## 工作示例

 样本1：```
Input:
1
6
12 6 18 3 9 15
```| 分裂| 左 GCD | 右 GCD | 检查 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 12 | 12 3 | 将左更改为 3 | 好 |
 | 2 | 6 | 3 | 将左更改为 3 | 好 |
 | 3 | 6 | 3 | 将左更改为 3 | 好 |
 | 4 | 3 | 3 | 已经平等| 好 |
 | 5 | 3 | 15 | 15 将右侧更改为 3 | 好 |

 该示例表明许多有效的分割不具有相等的原始 GCD。 基于一个不可分元素的修复条件是允许它们的。 

样本2：```
Input:
1
8
4 8 16 2 10 5 20 25
```| 分裂| 左 GCD | 右 GCD | 检查 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 1 | 右边已经有GCD 1 | 好 |
 | 2 | 4 | 1 | 右边已经有GCD 1 | 好 |
 | 3 | 4 | 5 | 太多不兼容的值 | 坏|
 | 4 | 2 | 5 | 太多不兼容的值 | 坏|
 | 5 | 2 | 5 | 太多不兼容的值 | 坏|
 | 6 | 1 | 5 | 将右侧更改为 1 | 好 |
 | 7 | 1 | 25 | 25 将右侧更改为 1 | 好 |

 该迹线显示了为什么算法只需要测试两个当前的 GCD 值。 任何其他可能的最终 GCD 都必须除以这些值之一，并且已被整除性查询覆盖。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个分割执行恒定数量的线段树查询，每个查询的时间复杂度为 O(log n)。 |
 | 空间| O(n) | 前缀数组、后缀数组和线段树都使用线性内存。 |

 所有测试用例的元素总数为$2 \cdot 10^5$，所以一个$O(n \log n)$解决方案很容易满足时间限制。 Python 的迭代 GCD 实现使常数因子保持较小。 

## 测试用例```python
import sys, io

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def solve_case(arr):
    n = len(arr)
    pref = [0] * n
    suff = [0] * n

    for i in range(n):
        pref[i] = gcd(pref[i - 1], arr[i]) if i else arr[i]

    for i in range(n - 1, -1, -1):
        suff[i] = gcd(suff[i + 1], arr[i]) if i + 1 < n else arr[i]

    tree = [0] * (4 * n)

    def build(node, l, r):
        if l == r:
            tree[node] = arr[l]
        else:
            m = (l + r) // 2
            build(node * 2, l, m)
            build(node * 2 + 1, m + 1, r)
            tree[node] = gcd(tree[node * 2], tree[node * 2 + 1])

    def bad(node, l, r, ql, qr, x):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr and tree[node] % x == 0:
            return 0
        if l == r:
            return 1
        m = (l + r) // 2
        res = bad(node * 2, l, m, ql, qr, x)
        if res > 1:
            return res
        return res + bad(node * 2 + 1, m + 1, r, ql, qr, x)

    build(1, 0, n - 1)

    ans = 0
    for i in range(n - 1):
        a, b = pref[i], suff[i + 1]
        if a == b or bad(1, 0, n - 1, 0, i, b) <= 1 or bad(1, 0, n - 1, i + 1, n - 1, a) <= 1:
            ans += 1
    return ans

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    t = data[0]
    idx = 1
    out = []
    for _ in range(t):
        n = data[idx]
        idx += 1
        arr = data[idx:idx+n]
        idx += n
        out.append(str(solve_case(arr)))
    return "\n".join(out)

assert run("""2
6
12 6 18 3 9 15
8
4 8 16 2 10 5 20 25
""") == """5
5"""

assert run("""1
2
6 10
""") == "1"

assert run("""1
5
7 7 7 7 7
""") == "4"

assert run("""1
2
1 1
""") == "1"

assert run("""1
5
2 3 5 7 11
""") == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`6 12 6 18 3 9 15`|`5`| 提供示例行为 |
 |`6 10`|`1`| 需要进行一次修改的拆分 |
 |`7 7 7 7 7`|`4`| 全部相等的值和已经匹配的 GCD |
 |`1 1`|`1`| 最小尺寸输入 |
 |`2 3 5 7 11`|`4`| 许多不兼容的 GCD 值和边界分割 |

 ## 边缘情况

 对于当前 GCD 不同但一个元素可以修复分裂的情况：```
Input:
1
2
6 10
```前缀 GCD 为 6，后缀 GCD 为 10。左侧段有一个不能被 10 整除的元素，这是允许的，因为该元素可以被替换。 线段树查询返回一个坏元素，因此分裂被计数。 

对于整条边包含多个不满足整除性要求的元素的情况：```
Input:
1
5
2 3 5 7 11
```考虑一侧的目标 GCD 为 3 的拆分。线段树检查该一侧并发现多个不能被 3 整除的数字。由于需要更改两个或更多元素，因此该拆分被拒绝。 该算法仅在违规次数最多为 1 时接受一方。
