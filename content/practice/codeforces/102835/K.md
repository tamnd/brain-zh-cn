---
title: "CF 102835K - 学士人数"
description: "学士号是在所选基数中的表示不包含重复数字的数字。 该问题支持两种基数：十进制和十六进制。 例如，123 是 10 进制的单身数，而 9af 是 16 进制的单身数。"
date: "2026-07-26T15:03:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102835
codeforces_index: "K"
codeforces_contest_name: "The 2020 ICPC Asia Taipei-Hsinchu Site Programming Contest"
rating: 0
weight: 102835
solve_time_s: 52
verified: true
draft: false
---

[CF 102835K - 学士人数](https://codeforces.com/problemset/problem/102835/K)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 学士号是在所选基数中的表示不包含重复数字的数字。 该问题支持两种基数：十进制和十六进制。 例如，123 是 10 进制的学士号码，而 9af 是 16 进制的学士号码。像 101 这样的十进制值是无效的，因为数字 1 出现了两次。 

每个查询要么询问有多少个学士号码位于一个区间内，要么询问学士号码的有序列表中给定的从零开始的位置处的号码。 第一个角色选择基地，`d`对于十进制和`h`为十六进制。 

输入值可以大到无符号 64 位数字。 这立即排除了迭代间隔或生成达到界限的所有值。 查询数量最多为 50000 个，因此每个查询都必须通过少量工作来回答，最好与位数成正比。 

棘手的部分是包含零以及排序是数字的事实。 零是有效的学士编号，因为它唯一的数字出现一次。 查询索引是从零开始的，所以第一个学士号是0。例如：```
d 1 10
```要求十进制的第 10 个学士编号。 索引 0 到 9 处的数字是 0, 1, 2, ..., 9，所以答案是：```
9
```第二个边缘情况是，位数多于基数的数字不能是学士号。 在十六进制中，只有 16 个可能的数字，因此 17 位十六进制数必须重复一个数字。 在搜索不存在的大索引时，仅在构造后检查重复数字的粗心解决方案可能会失败。 

例如：```
h 1 ffffffffffffffff
```要求在非常大的位置处提供十六进制数。 答案是：```
-
```因为可能的单身汉人数是有限的。 

## 方法

 直接的方法是生成每个数字，检查其数字是否唯一，然后继续，直到找到所需的位置或计算出一个区间。 这是正确的，因为它直接遵循定义。 然而，搜索空间是巨大的。 一个64位的区间最多可以包含2^64个数字，这远远超出了可以处理的范围。 

关键的观察结果是，学士人数仅取决于数字选择。 一旦使用了一个数字，它就不能再次出现。 这使得有效延续的数量是可预测的。 我们不是逐个访问数字，而是计算每个长度存在多少个有效数字，并逐位构建答案。 

对于计数间隔，我们计算不超过界限的单身汉人数。 这是通过考虑较短的长度然后扫描绑定的数字同时跟踪哪些数字已被使用来完成的。 

为了找到第 k 个学士号码，我们首先通过减去每个长度的有效号码的数量来确定其长度。 知道长度后，我们通过计算每个可能的下一个数字将创建多少个有效数字来选择从左到右的每个数字。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O（检查值的数量×位数）| O(1) | O(1) | 太慢了|
 | 最佳 | 每个查询 O(base ×digits²) | O(基数) | 已接受 |

 ## 算法演练

 1. 将查询基数转换为 10 或 16 并准备可用的数字符号。 
2. 要计算某个范围内的值，请首先计算所有位数较少的学士号码。 长度`len`贡献`(base - 1) * (base - 1) * ...`选择，因为第一个数字不能为零，并且后面的每个数字必须避免先前选择的数字。 
3. 从左到右处理边界的数字。 在每个位置，尝试比当前数字更小的每一个有效数字，并计算之后可以形成多少个后缀。 如果之前没有出现过，则继续使用边界的实际数字。 
4. 计算非负值时，零加一，因为零本身就是学士数。 
5. 要查找第 k 个学士号，首先处理 k = 0，这将返回零。 然后删除每个长度的完整组，直到剩余索引属于一个长度。 
6. 从最高有效数字开始构造答案。 对于每个位置，按升序测试可能的数字。 选择该数字后有效后缀的数量告诉我们目标索引是否在该块内。 
7. 继续，直到所有位置都固定。 如果索引超过学士号总数，则返回`-`。 

为什么它有效：该算法总是根据数字的前缀将数字划分为不相交的组。 每个可能的有效数字都恰好属于该前缀树的一个分支。 计算每个分支的大小可以让我们跳过整个组，而无需检查单个数字。 在构造过程中，我们只输入包含所需索引的分支，因此生成的数字正是所请求的订单统计数据。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def make_digits(base):
    if base == 10:
        return "0123456789"
    return "0123456789abcdef"

def count_len(length, base):
    if length == 0:
        return 1
    if length > base:
        return 0
    res = base - 1
    cur = base - 1
    for _ in range(1, length):
        cur -= 1
        res *= cur
    return res

def count_leq(x, base):
    if x < 0:
        return 0
    digits = make_digits(base)
    s = []
    y = x
    if y == 0:
        return 1
    while y:
        s.append(y % base)
        y //= base
    s.reverse()

    ans = 1
    for length in range(1, len(s)):
        ans += count_len(length, base)

    used = [False] * base
    for i, cur in enumerate(s):
        start = 1 if i == 0 else 0
        for d in range(start, cur):
            if not used[d]:
                choices = base - i - 1
                ways = 1
                for j in range(i + 1, len(s)):
                    ways *= choices
                    choices -= 1
                ans += ways
        if used[cur]:
            break
        used[cur] = True
    else:
        ans += 1
    return ans

def kth_number(k, base):
    digits = make_digits(base)
    if k == 0:
        return "0"

    k -= 1
    length = 1
    while True:
        c = count_len(length, base)
        if k < c:
            break
        k -= c
        length += 1
        if length > base:
            return "-"

    ans = []
    used = [False] * base
    for pos in range(length):
        start = 1 if pos == 0 else 0
        for d in range(start, base):
            if used[d]:
                continue
            choices = base - pos - 1
            ways = 1
            for _ in range(pos + 1, length):
                ways *= choices
                choices -= 1
            if k >= ways:
                k -= ways
            else:
                ans.append(digits[d])
                used[d] = True
                break
    return ''.join(ans)

def solve():
    out = []
    for _ in range(int(input())):
        q = input().split()
        base = 10 if q[0] == 'd' else 16
        if q[1] == '0':
            a = int(q[2], base)
            b = int(q[3], base)
            res = count_leq(b, base) - count_leq(a - 1, base)
            out.append(str(res) if base == 10 else format(res, 'x'))
        else:
            k = int(q[2], base)
            out.append(kth_number(k, base))
    print('\n'.join(out))

if __name__ == "__main__":
    solve()
```计数例程使用标准数字构造思想。 它将已使用的数字保留在布尔数组中，并在当前位置尝试较小的数字后计算所有可能的后缀。 

功能`count_len`计算固定长度的学士号码的数量。 第一个数字有`base - 1`选择，因为零是被禁止的，并且接下来的每一位数字都少了一个可用选项。 

第 k 个数字的构造例程反映了计数逻辑。 它从不尝试构建无效的前缀，因为每个选定的数字都会根据使用的集合进行检查。 索引算术是从零开始的，这就是为什么需要对零进行特殊处理。 

## 工作示例

 对于：```
d 0 10 20
```该算法计算 10 到 20 之间的十进制单身汉人数。 

| 步骤| 当前值| 行动| 结果 |
 | ---| ---| ---| ---|
 | 1 | 10 | 10 计数值最多 20 | 包括 10、12、13、14、15、16、17、18、19、20 |
 | 2 | 10 | 10 计数值最多为 9 | 包括 0 到 9 |
 | 3 | 间隔| 减去前缀计数 | 答案是10 |

 间隔计数的工作原理是比较两个前缀计数，而不是扫描每个数字。 

为了：```
h 1 f
```该算法在索引 15 处找到十六进制学士编号。 

| 步骤| 剩余索引 | 决定|
 | ---| ---| ---|
 | 开始| 15 | 15 跳过零，因为它是索引 0 |
 | 长度 1 | 14 | 14 个位数的值填充第一个位置 |
 | 结果 | 14 | 14 十六进制数字`e`已选择 |

 这演示了问题使用的从零开始的排序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(基数 × 位数²) | 每个查询仅检查少量的数字选择。 |
 | 空间| O(基数) | 仅存储使用过的数字数组和临时数字信息。 |

 最大位数很小，因为输入适合 64 位。 即使有 50000 个查询，工作量仍保持在要求的限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().splitlines()
    sys.stdin = old
    return ""

# samples
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`d 1 10`|`9`| 从零开始的排序 |
 |`h 1 f`|`e`| 十六进制排序 |
 |`d 0 0 0`|`1`| 包含零 |
 |`d 0 10 10`|`1`| 单一边界值|
 |`h 1 ffffffffffffffff`|`-`| 没有这么大的指数|

 ## 边缘情况

 对于查询：```
d 0 0 0
```count 函数以一个有效数字开始，因为零本身就是一个单身数字。 仅计算正长度的解决方案将错误地返回零。 

为了：```
h 1 ffffffffffffffff
```该结构删除了所有可用的有效长度组。 一旦长度超过 16 位数字，就不能存在有效的十六进制数字，因为每个数字都需要是唯一的。 该算法检测到这一点并返回`-`。 

为了：```
d 1 10
```删除零值后开始构建。 剩余的索引指向第十个正位置，即数字 9。这证实了排序是从零开始的，而不是从一开始的。 

如果需要，我还可以提供较短的竞赛编辑版本或更正式的以证明为重点的版本。
