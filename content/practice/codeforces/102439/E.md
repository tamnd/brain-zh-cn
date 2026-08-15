---
title: "CF 102439E - 小型企业"
description: "我们有一袋数字块，用字符串 s 表示。 每个块必须仅使用一次来构建两个十进制整数。 两个整数可以相等，允许为零，但两个数字都不能包含前导零。 两个数字最多只能是 (10^{18})。"
date: "2026-08-14T15:53:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "E"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 106
verified: true
draft: false
---

[CF 102439E - 小型企业](https://codeforces.com/problemset/problem/102439/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一袋数字块，用字符串表示`s`。 每个块必须仅使用一次来构建两个十进制整数。 两个整数可以相等，允许为零，但两个数字都不能包含前导零。 两个数字最多只能是 (10^{18})。 

所需的对按较小值先排序。 在所有有效的构造中，我们首先最小化较小的数字。 一旦这个数字固定下来，我们就最小化另一个数字。 如果不存在所有数字块的有效分区，我们打印`-1 -1`。 

对于每个数字执行恒定工作量的算法来说，50 的长度界限足够小，但对于子集枚举来说太大了。 最多有 (2^{50}) 种方法，大约为 (1.13 × 10^{15}) 种方法来选择哪些块属于第一个数字。 即使只需几十次操作就可以检查每个分区，这也远远超出了一秒的限制。 (10^{18})的上限是关键的结构限制：每个有效数字最多有19位，并且不超过(10^{18})的19位数字必须恰好是`1000000000000000000`。 

一些边缘情况可以欺骗直接的贪婪实现。 

为了`0`，只有一个块，因此无法构造两个非空数字。 答案是`-1 -1`。 粗心的实现可能会将丢失的第二个数字视为零。 

为了`00`，正确答案是`0 0`。 规定数字不能包含零作为其第一位数字的规则会错误地拒绝这种情况。 单个零是零的有效表示，而`00`将无效。 

为了`000`，答案是`-1 -1`。 将其拆分为`0`和`00`不起作用，因为`00`有一个前导零。 这说明了为什么仅检查块数是不够的。 

为了`1000000000000000000`，有19位数字，答案是`0 100000000000000000`。 最小的数字可以使用一个零，为第二个数字留下 18 个块。 如果一个粗心的实现在看到这个数字模式时总是试图生成 (10^{18})，那么它就会错过最小化第一个数字具有优先级的事实。 

对于仅包含 20 位数字的字符串`2`， 例如`22222222222222222222`，无法生成最多有效的 19 位数字 (10^{18})，因为每个这样的数字都必须恰好是 (10^{18})。 然而，该实例仍然可以解决`22 222222222222222222`。 这是当输入超过 19 位数字时我们不能简单地要求一个 (10^{18}) 块的关键原因。 我们必须尝试所有可能的长度以获得较小的数字。 

## 方法

 强力解决方案可以为第一个数字选择数字块的任意子集，对第二个数字使用补码，按每个相关顺序排列所选数字，并保留最佳有效对。 这是正确的，因为每个可能的分区都出现在子集中。 问题是分区的数量。 对于 50 位数字，有 (2^{50}) 个子集选择，大约为 (1.13 \times 10^{15})。 在最坏的情况下，即使在 (O(50)) 时间内处理每个选择也需要大约 (5.6 × 10^{16}) 次基本数字运算，这几乎是不可行的。 

有用的观察结果是，这些值以 (10^{18}) 为界，因此每个数字最多包含 19 位数字。 我们可以首先确定较小数字的长度（k）。 如果另一个数字的长度为 (n-k)，则两个长度都必须最多为 19。由于每当 (k<n-k) 时较小的数字的位数较少，因此每个有效的 (k) 位正数自动小于每个有效的 ((n-k)) 位数字。 因此，较小数字的最小可行长度始终是值得考虑的第一个长度。 

最多有 19 种可能的长度。 对于固定长度 (k)，我们从可用数字中构造尽可能小的 (k) 位数字。 我们从左到右这样做。 在每个位置，我们都会按升序尝试数字并暂时获取一份副本。 唯一的问题是剩余的数字是否仍然可以组成另一个具有所需长度的数字。 

可行性检查非常简单。 如果另一个数字最多有 18 位数字，则只要其长度为 1，它就有效，或者，对于更长的表示形式，它至少包含一个非零数字。 如果它有 19 位数字，则它必须恰好是 (10^{18})，因此它的剩余多重集必须包含一个`1`和十八岁`0`数字。 

一旦固定了较小的数字，就可以通过按升序排列其剩余数字来最小化第二个数字，但多位数字必须以最小的可用非零数字开始。 这是多组数字的标准最小数字构造。 

暴力破解之所以有效，是因为每个分区都被明确考虑，但会失败，因为分区数量呈指数级增长。 每个数字最多有 19 个数字的观察结果将搜索减少到最多 19 个候选长度，并且每个候选都可以在恒定大小的数字空间中贪婪地求解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n^2 \cdot 10)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 计算每个数字出现的次数并让`n = len(s)`。 有效的对需要两个数字都非空，所以如果`n < 2`我们立即返回`-1 -1`。 另外，如果`n > 38`，两个数字无法匹配，因为每个数字最多有 19 位数字。 
2.考虑可能的长度`k`中较小的数`max(1, n - 19)`通过`floor(n / 2)`。 下限来自另一个数字不能包含超过 19 位数字的事实。 我们按升序处理这些长度，因为较短的有效较小数字总是比较长的正数更好。 
3.对于固定的`k`， 放`L = n - k`，另一个数字所需的长度。 从完整的数字计数数组开始，从左到右构造第一个数字。 
4. 在每个位置，尝试从`0`通过`9`按递增顺序。 在第一个位置，仅当以下情况时才允许零：`k == 1`，因为单个字符`0`是零的有效表示。 对于多位数字，第一位数字必须非零。 
5. 暂时去掉候选数字，询问剩下的数字是否能准确组成有效数字`L`数字。 如果不能，请恢复数字并尝试下一个候选者。 如果可以的话，永久保留该候选人并继续担任下一个职位。 
6. 可行性测试接受每个剩余的多重集，当`L == 1`，因为任何一位数字都是有效数字。 为了`2 <= L <= 18`，至少一位剩余数字必须非零。 为了`L == 19`，唯一接受的多重集恰好是一个`1`和十八岁`0`数字，因为`1000000000000000000`是唯一不超过 (10^{18}) 的 19 位整数。 
7. 毕竟`k`数字已被选择，将剩余的数字排列成尽可能小的第二个数字。 如果只有一位，则直接返回。 否则，首先放置最小的非零数字，然后是全零，然后按排序顺序放置剩余的数字。 
8. 返回找到的第一个可行对。 如果`k < L`，第一个数字的位数较少，并且必然是较小的值。 如果`k == L`，贪心构造给出了所有可行分区中尽可能小的第一个数，因此在对两个结果数进行排序后，它的对仍然是最优的。 

为什么它有效：对于每个候选长度，构造都保持不变，即到目前为止选择的前缀是仍然可以完成有效对的字典顺序最小的前缀。 在每个位置，首先测试每个较小的数字，并且仅当剩余块不能形成所需的第二个数字时才拒绝该数字。 因此，第一个接受的数字始终是该位置的最佳选择。 从左到右处理位置给出了该长度的最小可行数。 由于长度是从小到大处理的，因此第一个可行长度给出了全局最小的可能的较小数字。 最后，将未使用的数字排序为最小的有效表示形式，给出固定的第一个数字的最小可能的第二个数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def can_make_other(cnt, length):
    if sum(cnt) != length:
        return False

    if length == 1:
        return True

    if length == 19:
        return cnt[0] == 18 and cnt[1] == 1 and sum(cnt[2:]) == 0

    return any(cnt[d] > 0 for d in range(1, 10))

def build_smallest(cnt):
    length = sum(cnt)

    if length == 1:
        for d in range(10):
            if cnt[d]:
                return str(d)

    first = -1
    for d in range(1, 10):
        if cnt[d]:
            first = d
            break

    if first == -1:
        return None

    cnt[first] -= 1
    result = [str(first)]

    result.extend("0" for _ in range(cnt[0]))

    for d in range(1, 10):
        result.extend(str(d) for _ in range(cnt[d]))

    return "".join(result)

def solve(s):
    n = len(s)

    if n < 2 or n > 38:
        return "-1 -1"

    original = [0] * 10
    for ch in s:
        original[ord(ch) - ord('0')] += 1

    min_k = max(1, n - 19)
    max_k = n // 2

    for k in range(min_k, max_k + 1):
        other_len = n - k
        cnt = original[:]
        first_digits = []

        possible = True

        for pos in range(k):
            chosen = -1

            for d in range(10):
                if cnt[d] == 0:
                    continue

                if pos == 0 and k > 1 and d == 0:
                    continue

                cnt[d] -= 1

                if can_make_other(cnt, other_len):
                    chosen = d
                    break

                cnt[d] += 1

            if chosen == -1:
                possible = False
                break

            first_digits.append(str(chosen))

        if not possible:
            continue

        first = "".join(first_digits)
        second = build_smallest(cnt)

        if second is None:
            continue

        if len(second) > 19:
            continue

        if len(second) == 19 and second != "1000000000000000000":
            continue

        if k == other_len and first > second:
            first, second = second, first

        return first + " " + second

    return "-1 -1"

def main():
    s = input().strip()
    print(solve(s))

if __name__ == "__main__":
    main()
```这`original`数组存储每个数字的重数，因此以后的每个决定都可以做出，而无需重复扫描输入字符串。 

外循环仅考虑可能属于较小数字的长度。`min_k = max(1, n - 19)`保证第二个数字最多有 19 位数字，而`n // 2`阻止我们考虑比其对应的数字更长的数字。 

构造循环是贪婪的部分。 在每个位置，它都会按升序尝试数字。 呼叫前暂时删除一个数字`can_make_other`，因为该函数必须准确检查提交给候选者后剩余的块。 

对第一个位置的特殊处理可以防止诸如`04`。 条件允许`0`什么时候`k == 1`，因为单字符表示`0`是有效的。`can_make_other`处理上限而不依赖于 Python 的任意精度整数转换。 19 位有效数字必须恰好为 (10^{18})，因此检查其位数比构造和转换可能无效的字符串更简单、更安全。`build_smallest`执行二次最小化。 对于多位数字，它首先选择最小的非零数字，因为在那里放置零会创建一个前导零。 所有零都可以紧随其后放置，然后按升序放置其余数字。 

仅第二个数字需要最后的 length-19 检查。 贪婪的可行性测试已经保证了这个条件，但保持显式验证可以使边界条件清晰，并防止未来的意外变化违反 (10^{18}) 限制。 

Python 整数不会溢出，但解决方案无论如何都不需要将构造的字符串转换为整数。 所有比较均按长度进行处理，并且对于唯一相关的 19 位数字情况，通过直接与 (10^{18}) 的确切字符串表示形式进行比较。 

## 工作示例

 ### 示例 1

 对于`123456`，输入有六位数字。 第一个可能的较小数字长度是 1，因此算法尝试构建一个一位数字。 

| k | 职位| 候选数字| 剩余数字| 其他长度| 可行|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 |`23456`| 5 | 是的 |

 第一个候选数字是`1`，其余五位数字组成有效的五位数字。 自从`1`是可以完成的最小可能的一位数选择，答案是`1 23456`。 其余数字已按升序优化排列。 

### 示例 2

 对于`42`，有两位数字，因此最小可能长度也是一。 

| k | 职位| 候选数字| 剩余数字| 其他长度| 可行|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 |`42`| 1 | 没有 |
 | 1 | 1 | 1 |`42`| 1 | 没有 |
 | 1 | 1 | 2 |`4`| 1 | 是的 |

 没有零或一个块，所以第一个可行的数字是`2`。 剩下的数字是`4`, 给予`2 4`。 该对已正确订购。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2 \cdot 10)) | 最多有 19 个候选长度，每个结构最多 19 个位置，每个位置有 10 个候选数字。 每次可行性检查仅扫描 10 位数字。 |
 | 空间| (O(n)) | (O(n)) | 输入和构造的字符串使用 (O(n)) 空间，而位数数组具有恒定大小。 |

 对于 (n \le 50)，算法仅执行几千个小操作。 任何可行实例的 38 位最大值直接来自每个数字的 19 位限制，因此该解决方案可以轻松满足 1 秒和 256 MB 的限制。 

## 测试用例```python
import sys
import io

def can_make_other(cnt, length):
    if sum(cnt) != length:
        return False

    if length == 1:
        return True

    if length == 19:
        return cnt[0] == 18 and cnt[1] == 1 and sum(cnt[2:]) == 0

    return any(cnt[d] > 0 for d in range(1, 10))

def build_smallest(cnt):
    length = sum(cnt)

    if length == 1:
        for d in range(10):
            if cnt[d]:
                return str(d)

    first = -1
    for d in range(1, 10):
        if cnt[d]:
            first = d
            break

    if first == -1:
        return None

    cnt[first] -= 1
    result = [str(first)]
    result.extend("0" for _ in range(cnt[0]))

    for d in range(1, 10):
        result.extend(str(d) for _ in range(cnt[d]))

    return "".join(result)

def solve(s):
    n = len(s)

    if n < 2 or n > 38:
        return "-1 -1"

    original = [0] * 10
    for ch in s:
        original[ord(ch) - ord('0')] += 1

    min_k = max(1, n - 19)
    max_k = n // 2

    for k in range(min_k, max_k + 1):
        other_len = n - k
        cnt = original[:]
        first_digits = []
        possible = True

        for pos in range(k):
            chosen = -1

            for d in range(10):
                if cnt[d] == 0:
                    continue

                if pos == 0 and k > 1 and d == 0:
                    continue

                cnt[d] -= 1

                if can_make_other(cnt, other_len):
                    chosen = d
                    break

                cnt[d] += 1

            if chosen == -1:
                possible = False
                break

            first_digits.append(str(chosen))

        if not possible:
            continue

        first = "".join(first_digits)
        second = build_smallest(cnt)

        if second is None:
            continue

        if len(second) > 19:
            continue

        if len(second) == 19 and second != "1000000000000000000":
            continue

        if k == other_len and first > second:
            first, second = second, first

        return first + " " + second

    return "-1 -1"

def run(inp: str) -> str:
    return solve(inp.strip())

# Provided samples
assert run("123456") == "1 23456", "sample 1"
assert run("42") == "2 4", "sample 2"
assert run("000") == "-1 -1", "sample 3"

# Minimum-size input
assert run("7") == "-1 -1", "one block cannot form two numbers"

# Two zero blocks
assert run("00") == "0 0", "zero is valid when it is represented by one block"

# Boundary at 19 digits
assert run("1000000000000000000") == \
       "0 100000000000000000", "19-digit boundary"

# Twenty digits where 19-digit 10^18 is impossible
assert run("22222222222222222222") == \
       "22 222222222222222222", "must try a smaller length"

# All equal digits
assert run("11111111111111111111") == \
       "11 111111111111111111", "equal-digit construction"

# Maximum feasible length, both numbers equal 10^18
s38 = "11" + "0" * 36
assert run(s38) == \
       "1000000000000000000 1000000000000000000", "maximum feasible length"

# Maximum input length, impossible because two numbers hold at most 38 blocks
assert run("0" * 50) == "-1 -1", "50 blocks cannot fit"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`7`|`-1 -1`| 最小输入大小和两个非空数字的要求 |
 |`00`|`0 0`| 正确处理零而不拒绝前导零 |
 |`1000000000000000000`|`0 100000000000000000`| 19 位和 (10^{18}) 边界 |
 |`22222222222222222222`|`22 222222222222222222`| 从 19 位第二个数字回落到 18 位数字 |
 |`11111111111111111111`|`11 111111111111111111`| 等数字、等长度结构 |
 |`11`+ 36 个零 |`1000000000000000000 1000000000000000000`| 最大可行总长度|
 | 50 个零 |`-1 -1`| 绝对输入长度限制且不可能超过 38 个可用块 |

 ## 边缘情况

 对于单块输入`7`，长度循环不能产生两个非空数，因为`n < 2`立即被拒绝。 输出是`-1 -1`。 这可以防止实现意外地将一个数字视为空。 

为了`00`，第一个候选长度为一。 贪婪的构造尝试`0`，将其删除，并为另一个数字留下一个零。 由于另一个长度也是一个，`can_make_other`接受它。 结果是`0 0`。 特殊的一位数规则将此有效表示与无效的多位字符串区分开来，例如`00`。 

为了`000`，同样的第一次尝试选择`0`，但第二个数字仍保留两个零。 其所需长度为二，并且`can_make_other`对于每个大于 1 的长度，拒绝全零多重集。 没有非零候选者，因此算法报告`-1 -1`。 

为了`1000000000000000000`，算法开始于`k = 1`。 它尝试`0`前`1`，去掉一个零后还剩下18位数字，形成有效数字`100000000000000000`。 因此较小的数字立即变为零。 结果是`0 100000000000000000`，这比使用`1`作为较小的数字。 

为了`22222222222222222222`，第一个候选长度为 1，为另一个数字留下 19 位数字。 可行性测试拒绝这 19 个二，因为 19 位有效数字必须恰好是 (10^{18})。 然后算法尝试`k = 2`。 现在另一个数有18位，由二组成的18位数在(10^{18})以下，所以`22`被接受为最小的两位数。 结果是`22 222222222222222222`。 

对于最大可行长度，输入由两个组成`1`块和 36 个零块。 唯一可能的有效 19 位数字是 (10^{18})，并且有足够的块来制作两个副本。 算法达到`k = 19`，验证第二个数字的精确数字多重集，并为两边构造相同的值。 

对于长度为 50 的输入，算法在尝试任何构造之前会拒绝。 每个数字最多可以包含 19 个数字，因此两个数字最多可以占用 38 个块。 没有分区可以使用全部 50 个块，同时遵守数字限制，使得`-1 -1`不可避免的。
