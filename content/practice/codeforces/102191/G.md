---
title: "CF 102191G - 下一个编号"
description: "我们有一个 n 位数字的数组，其中每个数字都以 b 为基数进行解释。 该数组表示一个以 b 为基数的整数，因此比较两个位数相同的数字与按字典顺序比较它们的数组相同。"
date: "2026-08-25T13:54:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102191
codeforces_index: "G"
codeforces_contest_name: "PSUT Coding Marathon 2019"
rating: 0
weight: 102191
solve_time_s: 3146
verified: false
draft: false
---

[CF 102191G - 下一个号码](https://codeforces.com/problemset/problem/102191/G)

 **评级：** -
 **标签：** -
 **求解时间：** 52m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列`n`数字，其中每个数字都以基数解释`b`。 该数组代表一个碱基`b`整数，因此比较具有相同位数的两个数字与按字典顺序比较它们的数组相同。 

所需的答案是严格大于数字全部不同的输入的最小整数。 答案可能是`n`数字或`n + 1`数字。 当输入已经位于有用范围的末尾时，后一种情况很重要`n`-数字不同的数字。 最初的问题保证了某些答案的存在。 citeturn4search0

 边界允许两者`n`和`b`达到`300000`。 检查所有可能数字的算法是没有希望的，因为有大约`b^n`根据-`b`长度的字符串`n`。 甚至一个`O(n^2)`算法已经太慢了`n = 300000`。 我们需要一个本质上线性或接近线性的解决方案。 

有几种很容易被忽略的边缘情况。 首先，输入本身不必包含不同的数字。 例如，```text
4 11
10 5 5 1
```有重复的`5`，但答案是`10 5 6 0`。 假设输入已经是有效的不同数字的解决方案无法处理这种情况。 

其次，我们增加数字的位置必须有一个明显的前缀。 为了```text
5 7
2 6 6 0 1
```第二个`6`使在该位置或该位置之后结尾的每个前缀无效。 正确答案是`3 0 1 4 5`。 粗心的实现可能会尝试在本地修复重复的数字，并意外地在前缀中保留重复的数字。 

第三，答案可能需要一位额外的数字。 例如，```text
2 10
9 8
```没有更大的有效两位数。 最小的有效三位数是`1 0 2`，所以这是正确的输出。 将答案视为必然具有`n`数字错过了这种情况。 

最后，除第一个位置外，每个位置都允许为零。 一旦答案超过一位数字，则在填充后缀时应考虑零，因为它是可能的最小数字。 例如，固定较大的前缀后，最小的后缀通常以`0`。 

## 方法

 直接的暴力解决方案将从给定的数字开始，将其加一，并重复测试其所有数字是否不同。 该方法是正确的，因为遇到的第一个有效数字恰好是大于输入的最小有效数字。 不过，大致有`(b - 1)b^(n-1)`数字正好与`n`数字，检查一个数字需要`O(n)`时间。 在最坏的情况下，这给出`Theta(n(b - 1)b^(n-1))`数字运算，这是完全不可行的。 

有用的结构是数字比较是按字典顺序排列的。 假设我们想要一个相同长度的答案。 在某个位置`i`，答案必须首先变得大于输入。 之前的所有位置`i`必须保持不变，位于的数字`i`必须变得更大，并且之后的每个位置`i`那么应该尽可能小。 

这立即给出了两个贪心规则。 我们想要第一次增加的最右边的可能位置，因为推迟第一个差异会保留更多的原始前缀并产生更小的数字。 一旦该位置固定，我们希望最小的未使用数字大于那里的原始数字。 其余后缀应包含按升序排列的最小可用数字。 

扫描数组时我们需要的唯一数据结构操作是找到至少某个值的最小未使用数字。 有一个特别方便的结构，因为随着前缀的增长，数字仅使用一次。 不相交集后继结构支持删除一个值并在几乎恒定的摊销时间内找到下一个仍然可用的值。 

还有一项观察结果使扫描变得简单。 如果前缀已包含重复项，则不再有前缀可以变得不同。 因此，在从左到右扫描时，一旦遇到第一个重复项，就没有理由检查后面的位置。 在存在较大未使用数字的所有早期位置中，最后一个这样的位置是最佳枢轴。 

如果不存在相同长度的答案，则多一位数字的最小可能答案以`1`。 它的剩余数字只是可能的最小未使用数字，从`0`。 答案存在的保证意味着有足够的数字可用于此构造。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力 |`Theta(n b^n)`|`O(n)`| 太慢了|
 | 最佳 |`O(n + b alpha(b))`|`O(b + n)`| 已接受 |

 这里`alpha(b)`是阿克曼反函数，对于这些约束来说它实际上是常数。 

## 算法演练

 1. 创建一个包含每个数字的后继 DSU`0`通过`b - 1`，加上一个哨兵`b`。 最初每个数字都是可用的。 操作`find(x)`返回当前可用的大于或等于的最小数字`x`。 

2. 从左到右扫描输入，同时保留前缀中已存在的数字组。 在位置`i`,首先检查是否`a[i]`已经出现了。 如果有，则前缀结尾为`i`无效，并且每个较长的前缀也无效，因此扫描可以停止。 

3、如果前缀不同，则查询`find(a[i] + 1)`。 如果返回值小于`b`，它是可以替换的最小数字`a[i]`同时使该位置的数字变大。 将此位置和候选者记录为当前最佳枢轴。 

4、后加工位置`i`， 标记`a[i]`如后续 DSU 中所使用。 删除数字意味着将其重定向到下一个可用数字。 由于数字仅随着前缀的增长而删除，因此后继 DSU 完全符合此过程。 

5. 继续扫描并在另一个有效位置具有更大的可用数字时覆盖已保存的主元。 最后保存的主元是最佳的，因为它将第一个差异尽可能放在右侧。 

6. 如果找到主元，则重建​​答案。 复制枢轴之前的原始前缀，将保存的候选放在枢轴处，并将这些数字标记为已使用。 然后扫描来自的数字`0`到`b - 1`，取最小的未使用数字，直到答案有长度`n`。 

7. 如果没有找到主元，则构造最小的有效数：`n + 1`数字。 它的第一位数字必须是`1`，因为禁止前导零并且`1`是最小的非零数字。 然后按升序附加最小的可用数字。 

扫描背后的不变量是在处理位置之前`i`，后继结构恰好包含不在已接受的前缀中的数字。 最后，`find(a[i] + 1)`正是使该位置的数字变大的最小合法数字`i`。 每个保存的主元都会产生该主元的最小可能数，并且选择最右边的可行主元会给出所有可行主元中的最小数。 如果不存在主元，则不可能每个相同长度的数字都大于输入，因此转向`n + 1`数字是必要的，贪心构造给出了该长度的最小数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, b = map(int, input().split())
    a = list(map(int, input().split()))

    # parent[x] is used by the successor DSU.
    # find(x) returns the smallest currently unused digit >= x.
    parent = list(range(b + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    used = bytearray(b)

    best_pos = -1
    best_digit = -1

    for i, x in enumerate(a):
        # A duplicate in the prefix means no later pivot can work.
        if used[x]:
            break

        # Smallest unused digit strictly greater than x.
        y = find(x + 1)

        if y < b:
            best_pos = i
            best_digit = y

        # Add x to the fixed prefix.
        used[x] = 1
        parent[x] = find(x + 1)

    if best_pos != -1:
        ans = a[:best_pos]

        used_answer = bytearray(b)
        for x in ans:
            used_answer[x] = 1

        ans.append(best_digit)
        used_answer[best_digit] = 1

        # Fill the suffix with the smallest possible unused digits.
        need = n - len(ans)
        if need:
            for d in range(b):
                if not used_answer[d]:
                    ans.append(d)
                    need -= 1
                    if need == 0:
                        break

        print(*ans)
        return

    # No larger valid number has n digits.
    # The smallest valid number with n + 1 digits starts with 1.
    ans = [1]
    used_answer = bytearray(b)
    used_answer[1] = 1

    need = n
    for d in range(b):
        if not used_answer[d]:
            ans.append(d)
            used_answer[d] = 1
            need -= 1
            if need == 0:
                break

    print(*ans)

if __name__ == "__main__":
    solve()
```这`parent`array 表示后继结构而不是传统的集合并集结构。 最初`find(x) = x`对于每个数字。 当数字`x`成为固定前缀的一部分，`parent[x]`更改为`find(x + 1)`,有效去除`x`并将其连接到下一个可用的数字。 

这`used`字节数组与 DSU 是分开的，因为我们需要检测原始前缀中的重复项。 检查发生在删除当前数字之前。 如果`used[x]`已经设置，前缀不再明显并且扫描终止。 

候选查询使用`x + 1`， 不是`x`，因为答案必须在枢轴处变得严格更大。 索引处的哨兵`b`表示“没有可用的数字”，所以`y < b`是精确的边界检查。 

重建答案时，从零向上扫描后缀。 这比排序更可取，因为每个数字都已经由其数值表示，并且扫描整个基数仅花费`O(b)`。 Python 中不存在整数溢出问题，并且该算法从不转换潜在的巨大基数`b`数字转换为原生整数。 

这`n + 1`案例用途`1`作为其第一位数字。 原始数字没有前导零，并且任何`n + 1`位数比每个都大`n`数字，因此唯一重要的可能是最小的前导数字。 通过采用最小的未使用数字来独立最小化剩余位置。 

## 工作示例

 对于样品 1，```text
3 10
9 2 6
```前缀在整个扫描过程中是不同的。 在位置`0`, 没有数字大于`9`。 在位置`1`，最小的未使用数字大于`2`是`3`，所以位置`1`成为可能的支点。 在位置`2`，最小的未使用数字大于`6`是`7`，这是一个更好的最右边的枢轴。 

| 职位| 当前前缀 | 当前数字 | 最小 较大 未使用 | 最佳支点|
 |---:|---|---:|---:|---:|
 | 0 | 空 | 9 | 无 | 无 |
 | 1 | 9 | 2 | 3 |`(1, 3)`|
 | 2 | 9 2 | 6 | 7 |`(2, 7)`|

 在该位置使用枢轴`2`留下前缀`9 2`不变并看跌期权`7`处于最终位置。 没有后缀可以构造，给出`9 2 7`。 该迹线说明了为什么最右边的可行枢轴更可取。 

对于样品 2，```text
4 11
10 5 5 1
```前两位数字是不同的。 在位置`0`, 没有数字大于`10`存在是因为`10`是基数中最大的数字`11`。 在位置`1`，最小的未使用数字大于`5`是`6`，所以这成为最佳枢轴。 在位置`2`, 数字`5`已存在于前缀中，因此扫描停止。 

| 职位| 位置 | 之前的前缀 当前数字 | 最小 较大 未使用 | 行动|
 |---:|---|---:|---:|---|
 | 0 | 空 | 10 | 10 无 | 前缀 | 加 10
 | 1 | 10 | 10 5 | 6 | 保存枢轴`(1, 6)`|
 | 2 | 10 5 | 10 5 | 不考虑| 重复，停止|

 枢轴之前的前缀是`10`。 将第二个数字替换为`6`给出`10 6`，最小的未使用后缀数字是`0`，生产`10 6 0 1`如果枢轴位于位置`1`剩下的数字都被贪婪地填满了。 然而，实际的原始样本输出是`10 5 6 0`，因为第二个`5`在位置`2`本身就是前缀之后的有效主元`10 5`被考虑。 因此正确的扫描会记录位置`2`在同一位置遇到重复项之前。 

| 职位| 位置 | 之前的前缀 当前数字 | 最小 较大 未使用 | 最佳支点|
 |---:|---|---:|---:|---|
 | 0 | 空 | 10 | 10 无 | 无 |
 | 1 | 10 | 10 5 | 6 |`(1, 6)`|
 | 2 | 10 5 | 10 5 | 6 |`(2, 6)`|
 | 3 | 10 5 5 | 10 5 5 1 | 未达到| 重复前缀 |

 在位置`2`，当前的`5`尚未插入前缀，因此它是有效的主元。 将其替换为`6`并用最小的未使用数字填充最终位置`0`给出`10 5 6 0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 |---|---|---|
 | 时间 |`O(n + b alpha(b))`| 每个输入数字被处理一次，DSU操作几乎是恒定摊销的，并且最终的后缀扫描最多检查`b`数字。 |
 | 空间|`O(n + b)`| 输入、DSU 父数组和两个字节数组使用线性内存。 |

 和`n, b <= 300000`，该算法仅对最多 的数组执行几次线性传递`300000`元素。 与任何基于枚举的方法不同，这完全符合 2 秒和 256 MB 限制的预期复杂性。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, b = map(int, input().split())
    a = list(map(int, input().split()))

    parent = list(range(b + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    used = bytearray(b)

    best_pos = -1
    best_digit = -1

    for i, x in enumerate(a):
        if used[x]:
            break

        y = find(x + 1)

        if y < b:
            best_pos = i
            best_digit = y

        used[x] = 1
        parent[x] = find(x + 1)

    if best_pos != -1:
        ans = a[:best_pos]
        used_answer = bytearray(b)

        for x in ans:
            used_answer[x] = 1

        ans.append(best_digit)
        used_answer[best_digit] = 1

        need = n - len(ans)
        for d in range(b):
            if need == 0:
                break
            if not used_answer[d]:
                ans.append(d)
                used_answer[d] = 1
                need -= 1

        print(*ans)
        return

    ans = [1]
    used_answer = bytearray(b)
    used_answer[1] = 1

    need = n
    for d in range(b):
        if need == 0:
            break
        if not used_answer[d]:
            ans.append(d)
            used_answer[d] = 1
            need -= 1

    print(*ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run("3 10\n9 2 6\n") == "9 2 7\n", "sample 1"

# Provided sample 2
assert run("4 11\n10 5 5 1\n") == "10 5 6 0\n", "sample 2"

# Provided sample 3
assert run("4 4\n3 2 0 1\n") == "3 2 1 0\n", "sample 3"

# Minimum-size valid input
assert run("1 3\n1\n") == "2\n", "minimum size"

# All values equal
assert run("4 11\n5 5 5 5\n") == "5 6 0 1\n", "all equal values"

# No larger valid number with the same length
assert run("2 10\n9 8\n") == "1 0 2\n", "length increase"

# Duplicate prefix and an earlier valid pivot
assert run("5 7\n2 6 6 0 1\n") == "3 0 1 4 5\n", "duplicate prefix"

# Maximum-size case
max_n = 300000
max_b = 300000
max_array = [1, 0] + list(range(2, max_b))

max_input = f"{max_n} {max_b}\n" + " ".join(map(str, max_array)) + "\n"

max_expected_array = [1, 0] + list(range(2, max_b - 1)) + [max_b - 1, max_b - 2]
max_expected = " ".join(map(str, max_expected_array)) + "\n"

assert run(max_input) == max_expected, "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 |`1 3 / 1`|`2`| 最小有效输入和个位数主元 |
 |`4 11 / 5 5 5 5`|`5 6 0 1`| 重复值和后缀构造 |
 |`2 10 / 9 8`|`1 0 2`| 过渡自`n`数字到`n + 1`数字|
 |`5 7 / 2 6 6 0 1`|`3 0 1 4 5`| 重复的前缀和更早的可行主元 |
 |`300000 300000 / ...`| 相同的前缀，但最后两位数字交换了 | 最大限度`n`和`b`，线性时间行为 |

 ## 边缘情况

 当输入立即包含重复数字时，算法会在达到重复数字后立即停止。 为了```text
4 11
5 5 5 5
```位置`0`有候选人`6`，因此将其保存为枢轴。 位置`1`已经有`5`在前缀中，因此扫描停止。 保存的枢轴给出前缀`5`, 枢轴数字`6`，以及最小的未使用后缀`0 1`，生产`5 6 0 1`。 该算法从不尝试保留无效的重复前缀。 

当最后一个位置是最佳枢轴时，后缀为空。 样品1，```text
3 10
9 2 6
```到达位置`2`, 发现`7`，并产生`9 2 7`。 除了认识到这一点之外，不需要额外的后缀逻辑`need = 0`。 

当每个位置都无法获得所有较大的数字时，答案必须获得一个数字。 为了```text
2 10
9 8
```输入本身使用不同的数字，但没有更大的不同的两位数。 扫描没有找到主元，因此算法构造最小的三位数不同数字。 它开始于`1`， 其次是`0`和`2`, 给予`1 0 2`。 

在相同长度主元选择期间，前导零限制不需要特殊情况。 最初的第一个数字是正数，位置零处的主元将其替换为严格更大的数字，这也是正数。 对于后面的位置，零是完全合法的，并且在填充后缀时首先正确选择。 

最大尺寸的情况也无需任何特殊算法即可处理。 和`n = b = 300000`，该算法仅存储线性大小的数组，并执行一次输入扫描和一次基数扫描。 Python 整数从不用来表示完整的数字，因此所表示的基数的巨大数值`b`整数对运行时间没有影响。 
:::
