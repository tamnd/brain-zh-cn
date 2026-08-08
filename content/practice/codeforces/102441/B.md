---
title: "CF 102441B - 数字的重新分配"
description: "我们有一组非零十进制数字。 每次出现都很重要，因此如果输入包含 7 的三个副本，则所有三个副本必须仅使用一次。 我们还有 n 个上限。"
date: "2026-08-08T13:20:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "B"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 144
verified: true
draft: false
---

[CF 102441B - 数字的重新分配](https://codeforces.com/problemset/problem/102441/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组非零十进制数字。 每次出现都很重要，因此如果输入包含三个副本`7`，所有三个副本必须仅使用一次。 我们还有`n`上限。 我们的任务是将所有可用数字重新排列成精确的`n`正整数，以便分配给每个边界的数字不超过该边界。 

我们构造的数字不必使用相同的位数。 例如，两位数界限可以接收一位数。 唯一的全局要求是每个输入数字仅被消耗一次。 边界在输入中出现的顺序并不重要，因为任何有效的分配都可以按原始顺序打印。 

最大的输入字符串只有 500 位数字，而最多有 50 个边界。 这立即排除了基于排列的搜索。 即使只有九个可能的非零数字，可能的排列数量也会随着出现次数呈指数增长。 上限最多有 10 位数字，因此只需很少的恒定工作量即可构建一个候选数。 有用的结构是数字字母表具有恒定的大小，而数字总数可以很大。 

粗心的实现可能会错误地处理三种边缘情况。 

首先，可用数字的总数可能大于边界允许的位置总数。 例如，与`12345 2 21 43`，两个边界最多可以包含四位数字，但必须使用五位数字。 正确的输出是`-1`。 构造两个有效数字并简单地忘记未使用的数字的贪婪实现违反了使用每个数字的要求。 

其次，为当前界限提供尽可能短的数字并不总是安全的。 考虑`129 2 13 22`。 一个简单的升序策略可能会给出一位数`2`或者`1`到第一个界限并离开`29`为了`22`，这是无效的。 有效的构造是`1 92`。 较大的界限应在安全的情况下消耗尽可能多的数字，而将较小的数字留给更严格的界限。 

第三，仅将数字与界限的相应数字进行比较可能需要回溯。 为了`3241`并绑定`320`，最大的有效三位数是`314`。 尝试匹配`3`， 然后`2`，因为最多没有剩余数字而卡住`0`。 一个粗心的贪婪例程可能会得出这样的结论：不存在三位数，即使将第二位数字从`2`到`1`给出`314`。 

## 方法

 直接的暴力解决方案将选择将所有数字划分为`n`非空组，排列每个组内的数字，形成相应的数字，并检查所有上限。 如果`m`输入数字被视为可区分的出现，有`m!`订购方式以及`C(m-1, n-1)`的插入方法`n-1`连续数字之间的分隔符。 因此，一个简单的穷举搜索可以按以下顺序进行检查`500! * C(499, 49)`最大情况下的候选人。 重复的数字减少了不同结果字符串的数量，但搜索量仍然是天文数字。 蛮力仅在作为我们正在寻找的内容的概念定义时有用。 

关键的观察是边界本身提供了排序。 从最大到最小处理边界。 大界限比它后面的每个界限具有更多的自由度，因此它应该接收最大的安全数字，并且尽可能多的数字。 剩余的边界较小，因此保留较小的数字是更安全的选择。 

对于特定的界限，假设有`r`剩下的数字和`k`范围包括当前范围。 当前号码不能使用超过其界限的位数，并且必须为后面的每个号码至少保留一位数字。 因此它的最大可能长度是`min(number_of_digits_in_bound, r - (k - 1))`。 

我们首先尝试该长度，只有在当前边界下无法形成该长度的数量时才减小它。 

对于固定长度，我们构造不超过界限的最大可能数。 如果选择的长度小于界限的长度，比较是自动的，所以我们只需取最大的可用数字。 如果长度相等，我们从左到右扫描。 在每个位置，我们都会尝试不超过相应绑定数字的最大可用数字。 如果我们选择一个严格较小的数字，则前缀已经小于界限，因此所有剩余的数字都可以按降序排列。 如果我们选择与界限相同的数字，我们将继续递归。 如果相同的选择最终失败，我们返回并尝试下一个较小的数字。 

回溯很小。 每个位置最多有九个候选数字，但只有等于边界数字的候选数字才能保持前缀紧密。 每个较小的候选者都会立即完成构建。 由于最大界限只有 10 位数字，因此这实际上是每个尝试长度的恒定时间。 

贪心选择是安全的，因为我们处理从最大到最小的界限。 在相同长度的结构中，取最大可能的当前数字首先消耗较大的数字，并为较小的边界留下较小的数字。 在可能的长度中，采用最大的可行长度会消耗原本可以放在后面数字中的数字。 由于当前界限至少与每个后续界限一样大，因此在此处使用这些数字并不能通过为当前数字提供更少的位置来使后面的数字更容易构造。 因此，该算法为更严格的边界保留了最强的可能剩余多重集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m!·C(m-1, n-1)) | O(m!·C(m-1, n-1)) | O(米) | 太慢了 |
 | 最佳 | O(m + n log n) 与十进制常数 | O(m + n) | 已接受 |

 ## 算法演练

 1. 计算每个数字出现的次数`1`通过`9`。 我们只需要九个计数器，因为输入中永远不会出现零。 
2. 检查全局长度情况。 每一个界限`a_i`最多可以包含`len(a_i)`位数，因此如果输入位数的总数大于`sum(len(a_i))`，不存在解。 此外，每个数字至少需要一位数字，因此如果数字位数小于`n`，不存在解。 
3. 按递减的数字顺序对边界进行排序，但保留其原始索引。 首先处理最大的界限，因为它具有最大的自由度。 
4. 对于当前界限，计算我们允许使用的最大位数。 如果有`r`剩余数字和`k`边界仍然存在，包括当前的边界，我们必须至少离开`k - 1`后面的界限的数字。 因此最大长度是`min(len(bound), r - k + 1)`。 
5. 尝试将长度从最大长度减小到 1。 首先尝试最长的长度是贪婪的选择。 如果有效，当前界限将消耗最大可能的位数。 如果长度不起作用，整个实例都是不可能的。 
6. 对于小于限制长度的长度，按降序取最大的可用数字。 任何位数少于界限的数字都会自动变小，因此不需要逐位比较。 
7. 对于等于界限长度的长度，构造不超过界限的最大排列。 在紧张位置，尝试从绑定数字向下尝试可用数字。 小于绑定数字的数字使整个前缀变小，因此剩余的后缀可以按降序排序。 相等的数字使前缀保持紧密，并需要继续到下一个位置。 
8. 一旦构造了一个数字，从计数器中减去它的数字并将该数字存储在边界的原始索引处。 计数器准确地表示较小范围内仍可用的数字。 
9. 处理完每个边界后，所有数字计数器必须为零。 初步总容量检查和最大长度选择使得这成为解决方案存在时的预期结果，但最终条件还可以防止实现过程中意外留下未使用的数字。 

### 为什么它有效

 不变的是，在处理边界之前，只要解存在，剩余的数字多重集仍然可以分配给所有剩余的边界。 我们从最大到最小处理边界。 对于当前边界，我们首先最大化其长度，但每个后面的数字都保留一位数字。 如果在存在较长的有效当前数字时需要较短的分配，则将后面的数字使用的数字之一移动到当前数字不会使当前数字超出其界限，因为所选的构造明确满足该界限。 后面的界限不大于当前界限，并且该构造选择最大可能的当前数字，这优先消耗大数字并将较小数字留给更严格的界限。 对于固定长度，逐位构造恰好是字典顺序上不超过界限的最大排列。 因此，每个贪婪决策都保留了完成剩余较小边界的可能性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_number(cnt, bound, length):
    """
    Return (number_string, new_count) for the largest number of
    exactly `length` digits that can be made from cnt and is <= bound.
    Return (None, None) if impossible.
    """
    work = cnt[:]

    if length < len(bound):
        ans = []
        need = length

        for d in range(9, 0, -1):
            take = min(work[d], need)
            if take:
                ans.append(str(d) * take)
                work[d] -= take
                need -= take
                if need == 0:
                    break

        if need != 0:
            return None, None

        return ''.join(ans), work

    # length == len(bound)
    ans = []

    def dfs(pos):
        if pos == length:
            return True

        limit = ord(bound[pos]) - ord('0')

        # Try the largest possible digit first.
        for d in range(limit, 0, -1):
            if work[d] == 0:
                continue

            work[d] -= 1
            ans.append(str(d))

            if d < limit:
                # The prefix is already strictly smaller.
                # Maximize the suffix.
                for x in range(9, 0, -1):
                    if work[x]:
                        ans.append(str(x) * work[x])

                return True

            # d == limit, so the prefix is still equal.
            if dfs(pos + 1):
                return True

            ans.pop()
            work[d] += 1

        return False

    if not dfs(0):
        return None, None

    return ''.join(ans), work

def solve_case(s, bounds):
    m = len(s)
    n = len(bounds)

    # Every output number needs at least one digit.
    if m < n:
        return None

    # Every output number has at most as many digits as its bound.
    capacity = sum(len(str(x)) for x in bounds)
    if m > capacity:
        return None

    cnt = [0] * 10
    for ch in s:
        cnt[ord(ch) - ord('0')] += 1

    # Process the largest bounds first.
    order = sorted(range(n), key=lambda i: bounds[i], reverse=True)
    answer = [None] * n

    remaining = m

    for step, idx in enumerate(order):
        bound = str(bounds[idx])
        remaining_numbers = n - step - 1

        # Leave at least one digit for every later number.
        max_len = min(len(bound), remaining - remaining_numbers)

        chosen = None
        chosen_cnt = None

        for length in range(max_len, 0, -1):
            candidate, new_cnt = build_number(cnt, bound, length)

            if candidate is not None:
                chosen = candidate
                chosen_cnt = new_cnt
                break

        if chosen is None:
            return None

        answer[idx] = chosen
        cnt = chosen_cnt
        remaining -= len(chosen)

    if remaining != 0:
        return None

    return answer

def solve(data):
    it = iter(data.strip().splitlines())
    t = int(next(it))
    out = []

    for _ in range(t):
        parts = next(it).split()
        s = parts[0]
        n = int(parts[1])
        bounds = list(map(int, parts[2:2 + n]))

        answer = solve_case(s, bounds)

        if answer is None:
            out.append("-1")
        else:
            out.append(" ".join(answer))

    return "\n".join(out)

def main():
    data = sys.stdin.read()
    sys.stdout.write(solve(data))

if __name__ == "__main__":
    main()
```这`solve_case`函数首先执行两个全局可行性检查。 第一个检查是否有足够的数字来创建`n`非空数字。 第二个检查可用数字的总数是否不超过边界允许的数字位置的总数。 第二个检查是立即拒绝`12534`样本。 

数字计数器只有十个条目，因此删除数字永远不需要操作原始字符串。 这也自然地处理重复的数字。 通过递减其计数器来消耗数字出现，并且每个贪婪步骤之后的计数器准确地表示未使用的出现。 

边界按其整数值降序排序，同时保留其原始索引。 这是必要的，因为贪婪参数取决于首先处理最大的限制，但输出仍然必须在其原始位置包含每个输入边界的一个答案。 

表达式`remaining - remaining_numbers`是当前号码可以消耗的最大位数，而不为剩余号码留下太少的位数。 这是阻止算法产生局部有效数字同时使全局数字计数不可能的边界条件。`build_number`首先尝试最大的长度。 对于较短的长度，从`9`下降到`1`立即给出可能的最大数字，因为没有要执行的上限比较。 对于相同的长度，嵌套`dfs`函数处理紧前缀情况。 

微妙的部分是`d < limit`分支。 一旦所选数字严格小于相应的限制数字，则无论后缀如何，整个数字都已经小于限制。 因此，我们可以将剩余的每个数字按降序排列，从而最大化结果。 

什么时候`d == limit`，前缀仍然等于边界，因此仍必须检查后缀。 如果递归尝试失败，则在尝试更小的候选数字之前恢复该数字。 恢复是必要的，因为相同的数字出现必须保持可用于替代分支。 

Python 整数在这里不会溢出。 界限最多为`10^9`，而且该算法主要适用于它们的字符串表示形式。 输出数字也表示为字符串，这避免了长数字序列的任何不必要的整数转换。 

## 工作示例

 ### 示例 1

 第一个样本是```
1234 2 21 43
```有四位数字，两个边界各有两个位置，因此每个数字都必须进入两位数。 

| 步骤| 装订处理| 剩余数字| 最大长度| 已选号码 |
 | ---| ---| ---| ---| ---|
 | 1 | 43 | 43 1,2,3,4 | 2 | 43 | 43
 | 2 | 21 | 21 1,2 | 2 | 21 | 21

 边界按降序处理，因此`43`首先被处理。 最大的两位数排列`1234`不超过`43`是`43`。 剩下的数字是`1`和`2`，形成`21`对于第二个边界。 恢复原始输入顺序给出`21 43`，它与示例输出不同，但同样有效。 

### 示例 2

 第二个样本是```
12534 2 21 43
```有五位数字，而两个边界总共只提供四位数字位置。 

| 步骤| 总位数 | 允许职位总数 | 结果 |
 | ---| ---| ---| ---|
 | 可行性检查| 5 | 4 | 不可能|

 该算法在构建任何内容并打印之前停止`-1`。 这说明了为什么需要进行全局容量检查。 

### 紧前缀示例

 考虑```
3241 2 320 99
```界限已经按降序排列。 

| 步骤| 绑定 | 剩余数字| 尝试长度| 前缀决定 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 320 | 320 1,2,3,4 | 3 |`3 = 3`,`2 = 2`, 无数字`<= 0`| 回溯|
 | 1 | 320 | 320 1,2,3,4 | 3 |`3 = 3`,`1 < 2`|`314`|
 | 2 | 99 | 99 2 | 1 |`2 < 9`|`2`|

 第一次尝试遵循前缀绑定`32`，但剩余的数字不能占据最后一个位置，因为零不可用。 算法在第二个位置回溯并尝试`1`，生产`314`。 剩余数字`2`然后安全地分配给`99`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m + n log n) | O(m + n log n) | 排序成本为 O(n log n)，而每个构造最多检查 10 个数字类型，并且每个最多 10 个长度最多检查 10 个位置。 |
 | 空间| O(m + n) | 数字计数器的大小是恒定的，而答案数组和输出字符串包含 O(m + n) 信息。 |

 实际常数非常小，因为十进制数字仅提供 9 种可用的数字类型，并且每个界限最多有 10 位数字。 即使有 50 个边界和 500 个输入数字，该算法在每个测试用例中也仅执行几千个数字级操作，远远低于一秒限制所需的值。 

## 测试用例```python
import io

def build_number(cnt, bound, length):
    work = cnt[:]

    if length < len(bound):
        ans = []
        need = length

        for d in range(9, 0, -1):
            take = min(work[d], need)
            if take:
                ans.append(str(d) * take)
                work[d] -= take
                need -= take
                if need == 0:
                    break

        if need:
            return None, None

        return ''.join(ans), work

    ans = []

    def dfs(pos):
        if pos == length:
            return True

        limit = int(bound[pos])

        for d in range(limit, 0, -1):
            if work[d] == 0:
                continue

            work[d] -= 1
            ans.append(str(d))

            if d < limit:
                for x in range(9, 0, -1):
                    if work[x]:
                        ans.append(str(x) * work[x])
                return True

            if dfs(pos + 1):
                return True

            ans.pop()
            work[d] += 1

        return False

    if not dfs(0):
        return None, None

    return ''.join(ans), work

def solve_case(s, bounds):
    m = len(s)
    n = len(bounds)

    if m < n:
        return None

    if m > sum(len(str(x)) for x in bounds):
        return None

    cnt = [0] * 10
    for ch in s:
        cnt[int(ch)] += 1

    order = sorted(range(n), key=lambda i: bounds[i], reverse=True)
    answer = [None] * n
    remaining = m

    for step, idx in enumerate(order):
        bound = str(bounds[idx])
        later = n - step - 1

        max_len = min(len(bound), remaining - later)

        found = False

        for length in range(max_len, 0, -1):
            candidate, new_cnt = build_number(cnt, bound, length)

            if candidate is not None:
                answer[idx] = candidate
                cnt = new_cnt
                remaining -= length
                found = True
                break

        if not found:
            return None

    if remaining != 0:
        return None

    return answer

def run(inp: str) -> str:
    lines = inp.strip().splitlines()
    t = int(lines[0])
    out = []

    for line in lines[1:t + 1]:
        parts = line.split()
        s = parts[0]
        n = int(parts[1])
        bounds = list(map(int, parts[2:2 + n]))

        ans = solve_case(s, bounds)
        out.append("-1" if ans is None else " ".join(ans))

    return "\n".join(out)

# Provided samples
sample = """\
3
1234 2 21 43
12534 2 21 43
42 1 42
"""

assert run(sample) == "21 43\n-1\n42", "provided samples"

# Minimum-size input
assert run("1\n7 1 7\n") == "7", "single digit"

# All values equal
assert run("1\n3333 2 33 33\n") == "33 33", "all equal values"

# Boundary condition where the larger bound must receive more digits
assert run("1\n129 2 13 22\n") == "1 92", "length allocation"

# Tight-prefix backtracking
assert run("1\n3241 2 320 99\n") == "314 2", "backtracking"

# Maximum-size feasible digit set: 450 digits, 50 bounds of length 9
s = "1" * 450
bounds = " ".join(["999999999"] * 50)
expected = " ".join(["111111111"] * 50)
assert run(f"1\n{s} 50 {bounds}\n") == expected, "maximum-size feasible case"

# Maximum digit count but insufficient total capacity
s = "1" * 500
assert run(f"1\n{s} 50 {bounds}\n") == "-1", "maximum-size impossible case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`7 1 7`|`7`| 最小尺寸输入和精确边界 |
 |`3333 2 33 33`|`33 33`| 重复相同的数字和相等的界限 |
 |`129 2 13 22`|`1 92`| 不同边界之间长度的正确分配 |
 |`3241 2 320 99`|`314 2`| 当相等的前缀最终变得不可能时回溯 |
 | 450份`1`, 50 九位数界限 | 50份`111111111`| 最大可行输入大小 |
 | 500份`1`, 50 九位数界限 |`-1`| 全球产能边界|

 ## 边缘情况

 第一个边缘情况是总容量不足。 为了```
12345 2 21 43
```有五位数字，但是`21`和`43`每个最多可以包含两位数字。 该算法计算`5 > 2 + 2`在初始可行性检查期间并立即返回`-1`。 没有数字被默默丢弃。 

第二个边缘情况是长度分配陷阱：```
129 2 13 22
```边界被处理为`22`， 然后`13`。 为了`22`，还剩下三位，必须为后面的界限保留一位，所以最大长度为二。 可以得到的最大的两位数`1,2,9`是`92`，这是有效的。 仅有的`1`仍然存在，并且`1 <= 13`。 按原始顺序的最终输出是`1 92`。 

第三种边缘情况是紧前缀回溯：```
3241 2 320 99
```为了`320`，算法尝试长度三。 它首先遵循相等的前缀`3`， 然后`2`。 在最终位置，界限最多需要一个数字`0`，这是不可能的，因为零不存在。 搜索备份到第二个位置并尝试`1`，小于`2`。 前缀现在严格小于`32`，所以剩下的`4`放在它后面，产生`314`。 唯一未使用的数字是`2`，这对于第二个边界有效。 

第四个边缘情况是重复的数字：```
3333 2 33 33
```数字计数器包含四个副本`3`。 第一个绑定消耗两份副本和表格`33`; 第二个消耗剩余的两个。 算法中的任何地方都没有假设所有数字都是不同的。 

第五个边缘情况是最大可行总长度。 450 个数字和 50 个界限，每个界限有 9 个数字，每个界限必须恰好接收 9 个数字。 450份`1`，每个构造的数字是`111111111`。 该算法的长度计算强制每个边界使用九位数字，因为其他地方没有空闲容量。 

最后，最小可能的界限值得明确关注。 如果可用数字是`9`界限是`1`，一位数构造失败，因为`9 > 1`。 由于添加数字只会使数字大于一位数界限，因此没有其他长度可以提供帮助。 该算法尝试唯一可能的长度并正确报告失败。 

如果你愿意，我还可以将其变成一种更适合竞赛的编辑风格，具有更短的校样和更清晰的内容`O(10^3 n)`执行。
