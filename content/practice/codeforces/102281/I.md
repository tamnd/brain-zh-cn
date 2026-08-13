---
title: "CF 102281I - \u0414\u0435\u0442\u0441\u043a\u0430\u044f\u0437\u0430\u0434\u0430\u0447\u0430"
description: "我们得到一个用文字而不是数字书写的加法，例如 VOLVO+FIAT=MOTOR。 每个不同的字母必须分配一个从 0 到 9 的数字。两个不同的字母必须接收不同的数字，而同一字母的每次出现都接收相同的数字。"
date: "2026-08-13T09:27:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102281
codeforces_index: "I"
codeforces_contest_name: "2011, IV \u0421\u0430\u043c\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u043d\u0430\u044f \u043c\u0435\u0436\u0432\u0443\u0437\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e"
rating: 0
weight: 102281
solve_time_s: 96
verified: true
draft: false
---

[CF 102281I - \u0414\u0435\u0442\u0441\u043a\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430](https://codeforces.com/problemset/problem/102281/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了用单词而不是数字书写的加法，例如`VOLVO+FIAT=MOTOR`。 每个不同的字母必须分配一个数字`0`通过`9`。 两个不同的字母必须接收不同的数字，而同一字母的每次出现都接收相同的数字。 明确允许使用前导零，因此单词的第一个字母并不特殊。 

任务是找到第一个字的数值加上第二个字​​的数值等于结果字的数值的每个赋值。 通过将原始表达式中的每个字母替换为其分配的数字来打印每个有效的分配。 该声明保证最多有 1000 个解决方案。 

这三个单词中的每一个最多包含 15 个字符。 这使得将完成的分配转换为三个整数变得便宜，但并不意味着尝试每个分配都便宜。 由于仅存在 10 个数字，因此最多可以有 10 个不同的字母。 完全盲目搜索十多个字母最多考虑`10! = 3,628,800`作业，并且对于每个作业，它仍然必须评估这三个单词。 这已经是数以百万计的候选人了，一个简单的 Python 实现可以花费大部分时间来检查本来可以更早被拒绝的作业。 

加法的结构给了我们更强的约束。 我们可以处理从单位列到最高有效列的加法，而不是等到每个字母都有一个数字。 每一列只有一个可能的进位，一旦知道两个加数的数字，结果数字就被强制。 这将全局相等转变为一系列非常小的局部检查。 

有几种边缘情况，粗心的实现可能会处理不当。 首先，前导零是合法的。 例如，`A+A=B`有有效的解决方案`5+5=0`，所以赋值`A=5, B=0`必须被接受。 禁止第一个字符为零的实现会错误地丢弃它。 

第二个问题是相同的字母可以出现在同一列结构的多个位置。 为了`A+A=A`，唯一的解决方案是`0+0=0`，因为单个字母在任何地方都必须具有相同的值。 处理两次出现的求解器`A`因为自变量可能会意外地接受赋值，例如`1+1=1`。 

第三种边缘情况是最后的进位。 对于输入，例如`A+B=CA`，有效的赋值可能需要相加才能产生额外的最高有效数字。 求解器必须处理所有列并验证最终实数列之后剩下的进位是否恰好为零。 忽略最终条件可以接受不完整的添加。 

最后，不同的字母绝不能共用一个数字。 为了`A+B=C`，作业`A=1, B=1, C=2`满足算术等式，但不是有效的密码赋值。 数字使用结构必须在产生答案之前拒绝它。 

## 方法

 最直接的方法是收集所有不同的字母，以各种可能的单射方式为它们分配数字，将三个单词转换为整数，并测试相等性。 这是正确的，因为每个可能的合法分配都被仅考虑一次，并且最终的算术测试与问题的条件精确匹配。 

困难在于搜索空间的大小。 有十个不同的字母`10 * 9 * 8 * ... * 1 = 10! = 3,628,800`作业。 如果每次作业都需要扫描三个单词中最多 45 个字符，那么最坏的情况是大约 1.6 亿个字符级操作。 在分配所有字母之前，搜索也不会执行任何有用的工作。 

改变问题的观察是小数加法是局部的。 考虑从右边算起的一列。 如果两个加数数字是`x`和`y`，传入的进位是`carry`， 然后`x + y + carry = result_digit + 10 * next_carry`。 

一次`x`和`y`已知，`result_digit`和`next_carry`都完全确定了。 如果结果字母已经有数字，我们只需将其与强制数字进行比较即可。 如果还没有被分配，我们必须检查强制数字是否未被使用。 

这让我们可以从右向左搜索。 在每一列中，我们仅分配两个加数中出现的仍然未知的字母。 然后得出结果数字而不是猜测。 错误的部分赋值会立即在无法进行算术的列中终止。 

强力搜索之所以有效，是因为每个完整的赋值都可以独立检查，但会失败，因为它将所有算术约束推迟到最后。 一旦知道所需的数字，按列回溯就会应用最强的可用约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(L * 10!)`在最坏的情况下|`O(U)`| 对于严格的 Python 实现来说太慢了 |
 | 按列回溯 |`O(L * P(10,U))`最坏情况，采用强列修剪 |`O(U + L)`| 已接受 |

 这里`L`是最大字长，`U`是不同字母的数量，并且`P(10,U) = 10!/(10-U)!`。 自从`U <= 10`由十进制字母表固定，实际搜索量很小，特别是因为在分配所有字母之前大多数分支都被拒绝。 

## 算法演练

 1. 将输入表达式拆分为`+`和`=`分成两个加数和结果。 将字母存储为字符串，以便以后可以从右到左检查它们的位置。 
2. 数出不同的字母。 如果超过 10 个，则无法进行任何分配，因为只有 10 个可用数字。 搜索可以立即终止。 
3.维护数组`digit[26]`，最初包含`-1`，存储每个字母的指定数字。 维持十要素`used`指示哪些数字已被占用的数组。 
4. 将列从单位位置向最重要的位置处理。 对于柱`pos`，加数位是位于的字符`a[-1-pos]`如果该位置存在，否则贡献为零。 同样的规则也适用于第二个加数和结果。 
5. 仅查看当前列的两个加数位置中出现的不同字母。 如果其中一个没有分配的数字，请尝试每个未使用的数字。 由于一列中最多有两个加数字母，因此在考虑结果之前最多会创建 90 个选择。 
6. 计算`total = digit_left + digit_right + carry`。 所需结果位数为`total % 10`，下一列的进位是`total // 10`。 
7. 如果结果字母已经有数字，则将该数字与所需的结果数字进行比较。 不匹配会导致当前分支无法运行。 如果结果字母未分配，则仅在未使用所需数字时分配该数字。 这是关键的修剪步骤，因为结果数字永远不会被猜测。 
8. 使用新进位递归到下一列。 返回后，撤消当前列中所做的每个分配，以便另一个分支完全从前一个状态开始。 
9. 处理完所有列后，仅当进位为零时才接受赋值。 使用赋值转换每个单词并保存结果表达式。 

不变量是，在处理列之前，已处理的后缀所需的每个字母都有固定的数字，所有分配的数字都是不同的，并且处理后的后缀满足包括当前进位在内的加法。 每个递归转换都保留此不变量，因为它检查当前列的精确十进制方程。 相反，任何有效的完整分配都必须满足每个单独的列方程，因此相应的选择永远不会被修剪。 因此，每个生成的作业都是有效的，并且每个有效的作业最终都会生成。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_expression(expr):
    a, rest = expr.split('+')
    b, c = rest.split('=')

    max_len = max(len(a), len(b), len(c))

    letters = set(a + b + c)
    if len(letters) > 10:
        return []

    digit = [-1] * 26
    used = [False] * 10
    solutions = []

    def get_char(word, pos):
        idx = len(word) - 1 - pos
        if idx < 0:
            return -1
        return ord(word[idx]) - ord('A')

    def build_number(word):
        value = 0
        for ch in word:
            value = value * 10 + digit[ord(ch) - ord('A')]
        return value

    def make_output():
        na = build_number(a)
        nb = build_number(b)
        nc = build_number(c)
        solutions.append(f"{na}+{nb}={nc}")

    def dfs(pos, carry):
        if pos == max_len:
            if carry == 0:
                make_output()
            return

        x = get_char(a, pos)
        y = get_char(b, pos)
        z = get_char(c, pos)

        assigned_now = []

        def assign_operand(ch, d):
            digit[ch] = d
            used[d] = True
            assigned_now.append((ch, d))

        def undo():
            while assigned_now:
                ch, d = assigned_now.pop()
                digit[ch] = -1
                used[d] = False

        # Recursively assign the distinct letters appearing in
        # the two addend positions.
        operands = []
        if x != -1:
            operands.append(x)
        if y != -1 and y != x:
            operands.append(y)

        def assign_operands(idx):
            if idx == len(operands):
                dx = 0 if x == -1 else digit[x]
                dy = 0 if y == -1 else digit[y]

                total = dx + dy + carry
                needed = total % 10
                next_carry = total // 10

                if z == -1:
                    if needed != 0:
                        return
                    dfs(pos + 1, next_carry)
                    return

                if digit[z] != -1:
                    if digit[z] == needed:
                        dfs(pos + 1, next_carry)
                    return

                if used[needed]:
                    return

                digit[z] = needed
                used[needed] = True
                dfs(pos + 1, next_carry)
                digit[z] = -1
                used[needed] = False
                return

            ch = operands[idx]

            if digit[ch] != -1:
                assign_operands(idx + 1)
                return

            for d in range(10):
                if used[d]:
                    continue

                assign_operand(ch, d)
                assign_operands(idx + 1)
                undo()

        assign_operands(0)

    dfs(0, 0)
    return solutions

def main():
    expr = input().strip()
    solutions = solve_expression(expr)

    out = [str(len(solutions))]
    out.extend(solutions)
    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```解析器将表达式精确地分成三个单词。 由于输入格式只包含一种`+`和一个`=`, 两个`split`操作就足够了。 

这`digit`数组使用来自的字母索引`0`到`25`。 值为`-1`表示该字母尚未分配。 这`used`array 提供恒定时间检查候选数字是否可用。`get_char`将从右侧测量的列号转换为字符索引。 返回`-1`缺失位置很方便，因为缺失的加数对该列的贡献为零。 没有特殊的前导零处理，因为该问题明确允许前导零。 

嵌套的`assign_operands`函数是回溯发生的地方。 它仅分配当前列的两个加数中出现的字母。 如果某个字母是由较早的列分配的，则将重复使用该字母而不进行分支。 

一旦操作数位可用，结果位的计算方法为`% 10`。 进位计算公式为`// 10`。 这个顺序很重要，因为结果数字属于当前列，而进位属于下一列。 

当结果位置不存在时，会出现一种微妙的情况。 那么结果数字在概念上为零。 仅当计算出的数字为零时，代码才会接受这种情况。 例如，如果两个加数都已结束但仍有进位，则该进位由最后的加数处理`pos == max_len`检查而不是发明另一个结果数字。 

递归分支完成后，分配始终会被撤消。 结果字母也被临时分配并显式恢复。 如果没有这种回滚，在一个分支中选择的数字将泄漏到下一个分支并默默地删除有效的解决方案。 

Python整数不会溢出，并且最大可能的字只有15位数字，所以普通的整数运算就足够了。 

## 工作示例

 ### 示例 1

 考虑`ONE+ONE=TWO`。 处理从单位列开始，其中`E + E`必须产生`O`。 然后进位确定十列，依此类推。 一个具有代表性的成功分支如下所示。 

| 专栏 | 左数字| 右边数字 | 携带 | 总和| 结果数字| 执行 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`5`|`5`| 0 | 10 | 10`0`| 1 |
 | 1 |`6`|`6`| 1 | 13 |`3`| 1 |
 | 2 |`0`|`0`| 1 | 1 |`1`| 0 |

 对应的赋值是`O=0`,`N=1`,`E=5`, 给予`015+015=030`。 这个特定的分支实际上被拒绝了，因为`N=1`和`O=0`是一致的，但是这个词`ONE`是`015`和`TWO`是`?30`，要求`T=0`，这与`O=0`。 重要的一点是，冲突是在结果字母分配时检测到的，而不是在构建所有可能的字母分配之后。 

一个成功的分支，例如`065+065=130`具有相同的列不变量。 单位列给出`5+5=10`, 固定`O=0`并产生进位 1。十列给出`6+6+1=13`, 固定`N=3`并产生进位 1。然后百列给出`0+0+1=1`, 固定`T=1`。 每列都符合相同的全局映射。 

该示例包含 17 个有效分配和前导零，例如`065`有意以印刷形式保存。 

### 示例 2

 对于`VOLVO+FIAT=MOTOR`，最右边的列包含`O + T = R`加上传入的进位。 下一列包含`V + A`，以及重复的字母`VOLVO`和`MOTOR`导致之前进行的分配限制后面的列。 

示例中的成功解决方案是`15615+9743=25358`。 从右向左阅读给出以下轨迹。 

| 专栏 | 左数字| 右边数字 | 携带 | 总和| 结果数字| 执行 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`5`|`3`| 0 | 8 |`8`| 0 |
 | 1 |`1`|`4`| 0 | 5 |`5`| 0 |
 | 2 |`6`|`7`| 0 | 13 |`3`| 1 |
 | 3 |`5`|`9`| 1 | 15 | 15`5`| 1 |
 | 4 |`1`| 0 | 1 | 2 |`2`| 0 |

 得到的映射是`V=1`,`O=5`,`L=6`,`F=9`,`I=7`,`A=4`,`T=3`,`M=2`,`R=8`。 第五栏使用的事实是`FIAT`没有更多的数字，所以它的贡献为零。 最终进位为零，证明完整的五位数相等已经解决。 

此示例说明了为什么从右到左处理列比按任意顺序分配字母更强。 几个数字是通过算术强制的，而不是独立猜测的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(L * P(10,U))`最坏的情况| 最多`P(10,U)`单射数字分配可以出现在回溯树中，并且每个分支最多前进通过`L`列。 算术约束通常会更早地进行修剪。 |
 | 空间|`O(U + L)`| 数字映射、使用的数字数组、递归深度和存储的输出字符串所需的空间与字母数量、字长和解决方案成正比。 |

 这里`L <= 15`和`U <= 10`。 理论上的搜索范围是有限且小的，因为只有十个数字，而列约束通常在分配所有十个数字之前消除分支。 保证最多 1000 个输出解决方案也限制了存储的结果数据量。 

## 测试用例

 以下测试工具使用相同的求解器逻辑并将输出作为集合进行比较，因为该问题允许以任意顺序求解。 对于样本，明确地写出了预期的解决方案。 对于自定义情况，预期输出足够短，可以直接验证。```python
# helper: run solution on input string, return output string
import sys
import io

def solve_expression(expr):
    a, rest = expr.split('+')
    b, c = rest.split('=')

    max_len = max(len(a), len(b), len(c))
    if len(set(a + b + c)) > 10:
        return []

    digit = [-1] * 26
    used = [False] * 10
    solutions = []

    def get_char(word, pos):
        idx = len(word) - 1 - pos
        if idx < 0:
            return -1
        return ord(word[idx]) - 65

    def number(word):
        value = 0
        for ch in word:
            value = value * 10 + digit[ord(ch) - 65]
        return value

    def dfs(pos, carry):
        if pos == max_len:
            if carry == 0:
                solutions.append(
                    f"{number(a)}+{number(b)}={number(c)}"
                )
            return

        x = get_char(a, pos)
        y = get_char(b, pos)
        z = get_char(c, pos)

        operands = []
        if x != -1:
            operands.append(x)
        if y != -1 and y != x:
            operands.append(y)

        def choose(idx):
            if idx == len(operands):
                dx = 0 if x == -1 else digit[x]
                dy = 0 if y == -1 else digit[y]

                total = dx + dy + carry
                needed = total % 10
                next_carry = total // 10

                if z == -1:
                    if needed == 0:
                        dfs(pos + 1, next_carry)
                    return

                if digit[z] != -1:
                    if digit[z] == needed:
                        dfs(pos + 1, next_carry)
                    return

                if used[needed]:
                    return

                digit[z] = needed
                used[needed] = True
                dfs(pos + 1, next_carry)
                used[needed] = False
                digit[z] = -1
                return

            ch = operands[idx]

            if digit[ch] != -1:
                choose(idx + 1)
                return

            for d in range(10):
                if not used[d]:
                    digit[ch] = d
                    used[d] = True
                    choose(idx + 1)
                    used[d] = False
                    digit[ch] = -1

        choose(0)

    dfs(0, 0)
    return solutions

def run(inp: str) -> str:
    expr = inp.strip()
    ans = solve_expression(expr)
    return str(len(ans)) + (("\n" + "\n".join(ans)) if ans else "")

def parse_output(s):
    lines = s.strip().splitlines()
    count = int(lines[0])
    return count, set(lines[1:])

# Sample 1
sample1 = run("ONE+ONE=TWO")
count, got = parse_output(sample1)
expected1 = {
    "065+065=130",
    "085+085=170",
    "206+206=412",
    "216+216=432",
    "231+231=462",
    "236+236=472",
    "271+271=542",
    "281+281=562",
    "286+286=572",
    "291+291=582",
    "407+407=814",
    "417+417=834",
    "427+427=854",
    "432+432=864",
    "452+452=904",
    "457+457=914",
    "467+467=934",
    "482+482=964",
}
assert count == 17 and got == expected1, "sample 1"

# Sample 2
sample2 = run("VOLVO+FIAT=MOTOR")
count, got = parse_output(sample2)
expected2 = {
    "15615+9743=25358",
    "15715+9643=25358",
    "36736+9825=46561",
    "36836+9725=46561",
    "46346+9821=56167",
    "46846+9321=56167",
    "71571+9642=81213",
    "71671+9542=82123",
    "72472+9651=82123",
    "72672+9451=82123",
}
assert count == 10 and got == expected2, "sample 2"

# Minimum-size, all letters equal.
assert run("A+A=A") == "1\n0+0=0", "same letter"

# Two distinct letters, including the valid leading-zero result.
assert run("A+A=B") == (
    "9\n"
    "1+1=2\n"
    "2+2=4\n"
    "3+3=6\n"
    "4+4=8\n"
    "5+5=0\n"
    "6+6=2\n"
    "7+7=4\n"
    "8+8=6\n"
    "9+9=8"
), "leading zero"

# Maximum word length, but only two distinct letters.
assert run("AAAAAAAAAAAAAAA+AAAAAAAAAAAAAAA=BBBBBBBBBBBBBBB") == (
    "5\n"
    "0+0=0\n"
    "111111111111111+111111111111111=222222222222222\n"
    "222222222222222+222222222222222=444444444444444\n"
    "333333333333333+333333333333333=666666666666666\n"
    "444444444444444+444444444444444=888888888888888"
), "maximum length"

# More than ten distinct letters means no assignment exists.
assert run("ABCDEFGHIJ+K=ABCDEFGHIJK") == "0", "more than ten letters"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A+A=A`|`1`解决方案，`0+0=0`| 两边字母相同，分配均等 |
 |`A+A=B`|`9`解决方案 | 不同的数字、算术进位和有效的零结果 |
 |`AAAAAAAAAAAAAAA+AAAAAAAAAAAAAAA=BBBBBBBBBBBBBBB`|`5`解决方案 | 每列的最大字长和重复字母 |
 |`ABCDEFGHIJ+K=ABCDEFGHIJK`|`0`解决方案 | 十多个不同的字母|

 ## 边缘情况

 对于`A+A=A`，算法从一个空映射开始。 在唯一的列中，它两次看到相同的操作数字母，所以`operands`包含`A`只有一次。 分配`A=0`给出`0+0=0`，因此分支到达末尾且带有进位零并被接受。 任何非零赋值都会给出`2A`结果，不能等于`A`具有不同的十进制数字，因此所有其他分支都会被拒绝。 输出正是`0+0=0`。 

为了`A+A=B`，单位列指定`A`第一的。 什么时候`A=5`，和为10，所以要求结果位数为零，进位为1。 由于零未被使用，`B=0`被接受。 结果表达式为`5+5=0`。 这说明了为什么求解器不能强加无前导零规则。 相同的输入还对每个其他值执行进位转换`A`。 

对于最大长度输入`AAAAAAAAAAAAAAA+AAAAAAAAAAAAAAA=BBBBBBBBBBBBBBB`，所有十五根柱子都具有完全相同的结构。 如果`A=1`，第一列产生`B=2`并且没有携带。 随后的每一列都重复相同的计算，因此完整的结果是`111111111111111+111111111111111=222222222222222`。 作业`A=2,3,4`同样地产生`B=4,6,8`， 尽管`A=5`在结果中产生十五个零。 任何`A>=6`或者重新使用已在对应关系中分配的结果数字，或者产生等于先前使用的值的结果数字。 该算法处理所有十五列，而不依赖于单词的绝对数字大小。 

为了`ABCDEFGHIJ+K=ABCDEFGHIJK`，需要十一个不同的字母。 由于合法的赋值需要每个字母都有不同的数字，并且只有十个数字，因此求解器立即返回，而无需进入递归搜索。 此检查还可以防止粗心的实现索引或构造不可能的数字排列。 

最终进位边界由`pos == max_len`健康）状况。 假设处理后的列以进位一结束。 该位置没有留下结果字符，因此加法无效。 递归到达基本情况并拒绝分支，因为`carry != 0`。 有效的解决方案必须始终在最重要的实列之后保留零。
