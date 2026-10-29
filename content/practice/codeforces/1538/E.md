---
title: "CF 1538E - 有趣的子串"
description: "我们拥有一种非常小的“编程语言”，其中变量存储字符串。 每个变量要么被分配一个长度最多为 5 的文字字符串，要么被定义为两个先前定义的变量的串联。"
date: "2026-06-16T15:08:31+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "hashing", "implementation", "matrices", "strings"]
categories: ["algorithms"]
codeforces_contest: 1538
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 725 (Div. 3)"
rating: 2100
weight: 1538
solve_time_s: 399
verified: true
draft: false
---

[CF 1538E - 有趣的子字符串](https://codeforces.com/problemset/problem/1538/E)

 **评分：** 2100
 **标签：** 数据结构、哈希、实现、矩阵、字符串
 **求解时间：** 6m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们拥有一种非常小的“编程语言”，其中变量存储字符串。 每个变量要么被分配一个长度最多为 5 的文字字符串，要么被定义为两个先前定义的变量的串联。 该程序是这样的赋值序列，只有最终变量的值才重要。 

我们的任务不是显式地重建最终的字符串，而是计算子字符串的次数`"haha"`出现在其中，包括重叠出现的情况。 

关键的限制是字符串的长度可能由于重复连接而呈指数增长。 即使每个基本字符串都很小，但重复`x = a + b`操作可以快速创建太大而无法实现的字符串。 因此直接模拟是不可能的。 

微妙的困难来自于重叠效应。 连接两个字符串时`A + B`, 出现次数`"haha"`可以完全出现在`A`，完全在`B`，或跨越它们之间的边界。 该边界行为仅取决于后缀`A`和前缀`B`，而不是其全部内容。 

打破简单方法的边缘情况都是关于这个边界的：

 第一种故障模式是忽略串联边界上的重叠。 例如，`"ha" + "ha"`不包含`"haha"`在任一半内部，但串联形成一次出现。 

第二种失败模式是尝试仅维护计数，而没有足够的前缀和后缀信息。 例如，如果我们只跟踪有多少`"haha"`如果出现在每个变量内部，我们就失去了检测连接后形成的新事件的能力。 

第三种故障模式是错误地截断字符串。 我们不需要完整的字符串，但我们确实需要足够的上下文，以便可以检测到每个可能的跨界匹配。 由于模式长度为四，因此保留小的固定前缀和后缀就足够了。 

## 方法

 强力解释将显式构建每个字符串，然后扫描它是否出现`"haha"`。 每次串联都会复制整个字符串，并且计数需要线性扫描。 由于字符串大小在每一步都会加倍，因此之后`n`操作字符串长度可以达到指数大小，使得这种方法即使对于最大`n = 50`。 

关键的观察是我们只关心长度为四的固定模式的匹配。 任何情况的发生`"haha"`完全位于四个字符的本地窗口内。 连接两个字符串时，任何跨越边界的新出现都必须从左侧字符串的最后三个字符开始，并延伸到右侧字符串的前三个字符。 因此，每个变量维护三条信息就足够了：`"haha"`其中的出现次数、最多三个字符的前缀和最多三个字符的后缀。 

通过这种表示，串联变得恒定时间：添加内部计数，并通过检查后缀和前缀之间最多三个重叠位置来计算边界交叉。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力字符串构造 | O(总字符串大小) | O(总字符串大小) | 太慢了|
 | 具有计数 + 前缀/后缀修剪的 DP | 每次测试 O(n) | O(n) | 已接受 |

 ## 算法演练

 我们按顺序处理语句，为每个变量维护一个由三个部分组成的紧凑状态：`"haha"`出现次数、字符串的前三个字符和最后三个字符。 

1. 如果语句的形式为`x := s`，我们直接初始化变量。 我们计算出现次数`"haha"`在`s`自从用蛮力`|s| ≤ 5`，并存储前缀和后缀（截断为长度3）。 这是安全的，因为字符串很小。 
2. 如果一个语句是`x = a + b`，我们将存储的状态组合起来`a`和`b`。 内部总计数开始为`cnt[a] + cnt[b]`。 
3. 然后我们计算跨边界事件。 自从`"haha"`长度为 4，任何交叉事件都必须通过后缀形成`a`和前缀`b`。 我们尝试所有我们采取的分裂方式`k`从末尾开始的字符`a`（从 1 到 3）和`4-k`从 开始的字符`b`，检查连接是否等于`"haha"`。 每场比赛都会增加计数。 
4. 我们构造新的前缀`a.prefix + b.prefix`并修剪至最多3的长度。 
5. 我们以类似的方式构造新后缀`a.suffix + b.suffix`，也修剪至最多3的长度。 
6. 最终答案是存储在最后一条语句中使用的变量中的计数。 

这样做的原因是每次出现`"haha"`要么完全包含在组件之一内，要么跨越串联边界。 任何跨越事件必须与边界相交，每边最多 3 个字符，因为模式长度为 4。我们的前缀和后缀存储保证我们永远不会丢失检测此类重叠所需的任何信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def calc_small(s):
    cnt = 0
    for i in range(len(s) - 3):
        if s[i:i+4] == "haha":
            cnt += 1
    return cnt

def merge(a, b):
    cnt = a[0] + b[0]

    A = a[1]
    B = b[2]

    # cross boundary check
    for k in range(1, 4):
        if k <= len(a[2]) and (4 - k) <= len(b[1]):
            if a[2][-k:] + b[1][:4 - k] == "haha":
                cnt += 1

    new_pref = (a[1] + b[1])[:3]
    new_suf = (a[2] + b[2])[-3:]

    return (cnt, new_pref, new_suf)

t = int(input())
for _ in range(t):
    n = int(input())
    mp = {}

    last_var = None

    for _ in range(n):
        parts = input().strip().split()

        if ":=" in parts:
            x = parts[0]
            s = parts[2]
            cnt = calc_small(s)
            mp[x] = (cnt, s[:3], s[-3:])
            last_var = x
        else:
            x = parts[0]
            a = parts[2]
            b = parts[4]
            mp[x] = merge(mp[a], mp[b])
            last_var = x

    print(mp[last_var][0])
```该实现依赖于将每个字符串压缩为恒定大小的签名。 这`calc_small`函数是安全的，因为基本字符串的长度最多为 5。 这`merge`函数是核心：它只检查每侧最多三个字符，这足以检测四字符模式的所有边界出现。 

一个常见的陷阱是错误地迭代边界分割。 我们显式测试了将 4 字符模式拆分为两个字符串的所有方式，确保不会遗漏任何重叠情况。 另一个微妙的点是保持前缀和后缀的长度上限为三； 更长的存储时间是不必要的，并且会带来意外 O(n²) 行为的风险。 

## 工作示例

 考虑变量反复演变和连接的第一个样本。 

为简单起见，仅跟踪最终有意义的变量`d`。 

| 步骤| 运营| 计数 | 前缀| 后缀 |
 | --- | --- | --- | --- | --- |
 | 一个 |`"h"`| 0 | 小时 | 小时 |
 | 乙|`"aha"`| 0 | 啊哈| 啊哈|
 | c | a + b | 1 | 啊哈→`hah`| 啊哈→`aha`|
 | c | c + c | 3 | 哈哈+哈哈→`hah`| 啊哈+啊哈→`aha`|
 | 电子| c + c | 3 | 哈哈| 啊哈|
 | d | 一个+c| 3 | 哈 + 哈 →`hah`| 啊哈 →`aha`|

 该轨迹表明，除了边界附近之外，大多数增长都是无关紧要的。 仅当形成跨界组合时计数才会增加`"haha"`。 

现在考虑指数增长的情况，其中`x := haha`反复翻倍。 每次加倍都会保留结构，并且跨界重叠会产生大量新的出现，从而在表示大小保持不变的同时，在计数中产生指数增长。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个语句执行恒定的工作，因为合并仅检查固定数量的边界情况 |
 | 空间| O(n) | 我们为每个变量存储一个恒定大小的状态 |

 这些约束允许每个测试用例最多 50 个语句和 1000 个测试用例，因此该解决方案很容易在限制范围内。 每个操作的时间都是恒定的，并且存储形式中的字符串长度不会超过 3。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    def calc_small(s):
        cnt = 0
        for i in range(len(s) - 3):
            if s[i:i+4] == "haha":
                cnt += 1
        return cnt

    def merge(a, b):
        cnt = a[0] + b[0]
        for k in range(1, 4):
            if k <= len(a[2]) and (4 - k) <= len(b[1]):
                if a[2][-k:] + b[1][:4-k] == "haha":
                    cnt += 1
        return (cnt, (a[1] + b[1])[:3], (a[2] + b[2])[-3:])

    t = int(input())
    for _ in range(t):
        n = int(input())
        mp = {}
        last = None

        for _ in range(n):
            parts = input().split()
            if ":=" in parts:
                x = parts[0]
                s = parts[2]
                mp[x] = (calc_small(s), s[:3], s[-3:])
                last = x
            else:
                x = parts[0]
                a = parts[2]
                b = parts[4]
                mp[x] = merge(mp[a], mp[b])
                last = x

        print(mp[last][0])

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample 1
assert run("""4
6
a := h
b := aha
c = a + b
c = c + c
e = c + c
d = a + c
15
x := haha
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
x = x + x
1
haha := hah
5
haahh := aaaha
ahhhh = haahh + haahh
haahh = haahh + haahh
ahhhh = ahhhh + haahh
ahhaa = haahh + ahhhh
""") == """3
32767
0
0"""

# custom cases
assert run("""1
1
a := haha""") == "1", "single exact match"

assert run("""1
2
a := ha
b := ha
c = a + b""") == "1", "boundary match only"

assert run("""1
3
a := h
b := a + a
c = b + b""") == "0", "no possible match"

assert run("""1
1
x := aaaaa""") == "0", "no pattern present"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个精确匹配 | 1 | 直接基串计数 |
 | 仅边界匹配 | 1 | 跨界检测正确性|
 | 没有可能的匹配 | 0 | 没有发生的情况下的正确性 |
 | 没有图案存在| 0 | 安全处理不相关的字符串|

 ## 边缘情况

 关键的边缘情况是完整出现的情况完全跨越串联边界进行分割。 用于输入`a := ha`和`b := ha`，两边各自不包含`"haha"`，但它们的串联形成一个有效的事件。 该算法通过使用后缀和前缀组合显式检查所有边界分割来处理此问题。 

另一种情况是重复加倍，其中短字符串的概念大小迅速增长。 例如，从`x := haha`并反复申请`x = x + x`，出现的次数呈指数增长。 该算法处理这个问题是因为它从不扩展字符串，并且每次加倍都是使用前缀后缀重叠逻辑在恒定时间内处理。 

第三种情况是根本不包含模式但仍然通过后缀-前缀结构影响未来匹配的字符串。 即使内部计数为零，存储的前缀和后缀仍然是必需的，并且算法独立于出现计数来保留它们，确保仍然正确评估未来的串联。
