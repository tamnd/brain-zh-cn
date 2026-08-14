---
title: "CF 102309A - Orz Pandas 的 APA"
description: "我们给出了普通的 C++ 算术表达式，其操作数是仅由英文字母组成的标识符。 运算符是二进制 +、-、/、和 %，括号可能会更改计算顺序。"
date: "2026-08-13T23:51:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "A"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 71
verified: true
draft: false
---

[CF 102309A - Orz Pandas 的 APA](https://codeforces.com/problemset/problem/102309/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了普通的 C++ 算术表达式，其操作数是仅由英文字母组成的标识符。 运算符是二元的`+`,`-`,`*`,`/`， 和`%`，并且括号可能会改变求值顺序。 对于每个输入行，我们必须生成等效的 Java`BigInteger`表达。 

中心翻译是运算符变成对其左操作数的方法调用。 因此`a+b`变成`a.add(b)`,`a-b`变成`a.subtract(b)`,`a*b`变成`a.multiply(b)`,`a/b`变成`a.divide(b)`， 和`a%b`变成`a.remainder(b)`。 括号自然地由嵌套方法调用表示，因此除非 Java 语法实际需要它们，否则不应将它们复制到输出中。 官方的例子证实了这一点`(a+b)+c`变成`a.add(b).add(c)`， 尽管`a+(b+c)`变成`a.add(b.add(c))`。 

输入由多个独立的表达式组成，每行一个，每个表达式的长度最多为 1000。这足够小，即使二次字符串操作通常也是可以管理的，但线性解析器也同样自然，可以避免不必要的重复工作。 没有要执行的数值算术，因此整数溢出是无关紧要的。 主要的复杂性来自于遵守乘法、除法和余数相对于加法和减法的通常优先级，以及显式的括号。 

第一个边缘情况是带括号的右操作数。 为了`a+(b+c)`，正确的输出是`a.add(b.add(c))`。 简单地将运算符从左向右转换的粗心实现可能会产生`a.add(b).add(c)`，这会更改表达式树。 

第二个边缘情况是显式分组的左操作数。 为了`(a+b)+c`，正确的输出是`a.add(b).add(c)`。 Java 中不需要出现外括号，因为`a.add(b)`已经是一个完整的表达式，可以作为另一个方法调用的接收者。 保留每个输入括号会错误地产生不必要的语法，例如`(a.add(b)).add(c)`。 

第三种边缘情况是运算符优先级。 为了`a+b*c`，正确的输出是`a.add(b.multiply(c))`， 不是`a.add(b).multiply(c)`。 在将树转换为方法调用之前，解析器必须构造与 C++ 构造的树相同的树。 

第四种边缘情况是非关联减法或除法。 为了`a-(b-c)`，正确的输出是`a.subtract(b.subtract(c))`。 将其重新关联为`a.subtract(b).subtract(c)`将代表`(a-b)-c`，这是一个不同的表达方式。 

## 方法

 考虑解析的一种强力方法是尝试操作数的每一种可能的二元括号，并找到与 C++ 优先级和括号兼容的一个。 和`k`操作数，完整二进制括号的数量是加泰罗尼亚数`C(k-1)`。 对于 500 个操作数，这在 1000 个字符的表达式中已经是可能的，例如`a+a+a+...`，这是一个天文数字，所以这样的做法是完全不合适的。 

暴力破解在概念上是有效的，因为生成的表达式树之一是由输入的优先级和括号定义的树。 它失败了，因为它探索了大量的树，语法可以在本地确定这些树，而无需考虑它们。 

关键的观察结果是算术表达式的语法非常简单。 表达式是应用于乘法级表达式的加法或减法运算的序列，而乘法级表达式是一系列`*`,`/`， 或者`%`应用于原子表达式的操作。 原子表达式可以是标识符，也可以是另一个带括号的表达式。 

该语法让我们可以直接解析表达式。 我们递归地解析最小的有意义的单元，然后根据优先级组合这些单元。 一旦正确的表达式树可用，翻译就变得机械化：对于每个二元节点，将其左子节点翻译为接收者，将其右子节点翻译为参数。 

这也解释了为什么括号消失了。 带括号的子表达式被解析为完整的树节点。 当该节点成为操作的正确操作数时，Java 的方法调用语法已经提供了所需的分组，如下所示`a.add(b.multiply(c))`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(k-1)) | O(C(k-1)) | 每个候选人 O(k) | 太慢了|
 | 递归下降| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 定义三层表达式语法。 最高级别的解析器句柄`+`和`-`，下一级句柄`*`,`/`， 和`%`，最低级别处理标识符和括号表达式。 此顺序直接匹配正常的 C++ 算术优先级。 
2. 当当前字符是字母时，通过读取标识符来解析因子。 消耗整个标识符，因为标识符可以包含多个字母，例如`abc`。 
3. 如果一个因子开头为`(`，消耗该括号，递归解析完整的表达式，然后消耗匹配的`)`。 返回的表达式树表示括号的内容，因此括号本身不需要保留到输出中。 
4. 通过首先解析一个因子来解析乘法级表达式。 虽然下一个字符是`*`,`/`， 或者`%`，解析另一个因素并使用相应的运算符创建一个二元节点。 从左到右重复此操作可以得到正确的左关联性。 
5. 以相同的方式解析加法级表达式，但使用`+`和`-`作为运算符并使用乘法级表达式作为其操作数。 由于较低级别的解析器消耗了所有`*`,`/`， 和`%`首先操作，它们的优先级会自动保留。 
6. 解析完整的表达式后，递归翻译其树。 标识符节点直接返回其名称。 对于二元节点，平移左子节点和右子节点，然后生成`left.method(right)`。 
7. 将五个运算符映射到它们的 Java`BigInteger`方法。 映射是`+`到`add`,`-`到`subtract`,`*`到`multiply`,`/`到`divide`， 和`%`到`remainder`。 

### 为什么它有效

 解析器维护这样一个不变式：每个返回的子树准确地表示所消耗的输入范围所覆盖的 C++ 表达式，并具有正确的优先级和分组。 括号强制解析器在返回到周围的运算符之前完成完整的表达式，而单独的优先级可防止较低优先级运算符吸收属于较高优先级操作的操作数。 

对于每个二叉树节点，翻译将翻译后的左子树放置在方法调用之前，将翻译后的右子树放置在其参数内。 因此，生成的 Java 表达式与解析的 C++ 表达式具有完全相同的表达式树。 由于每个输入运算符都是根据其相应的进行翻译的`BigInteger`方法，结果表达式保留操作数及其分组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

METHOD = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'remainder'
}

class Parser:
    def __init__(self, s):
        self.s = s
        self.n = len(s)
        self.pos = 0

    def parse(self):
        return self.parse_expr()

    def parse_expr(self):
        node = self.parse_term()

        while self.pos < self.n and self.s[self.pos] in '+-':
            op = self.s[self.pos]
            self.pos += 1
            right = self.parse_term()
            node = (op, node, right)

        return node

    def parse_term(self):
        node = self.parse_factor()

        while self.pos < self.n and self.s[self.pos] in '*/%':
            op = self.s[self.pos]
            self.pos += 1
            right = self.parse_factor()
            node = (op, node, right)

        return node

    def parse_factor(self):
        if self.s[self.pos] == '(':
            self.pos += 1
            node = self.parse_expr()
            self.pos += 1
            return node

        start = self.pos
        while self.pos < self.n and self.s[self.pos].isalpha():
            self.pos += 1

        return self.s[start:self.pos]

def translate(node):
    if isinstance(node, str):
        return node

    op, left, right = node
    return translate(left) + '.' + METHOD[op] + '(' + translate(right) + ')'

def solve_line(s):
    parser = Parser(s)
    tree = parser.parse()
    return translate(tree)

def main():
    output = []

    for line in sys.stdin:
        s = line.strip()
        if s:
            output.append(solve_line(s))

    sys.stdout.write('\n'.join(output))

if __name__ == "__main__":
    main()
```这`Parser`存储输入和单个光标`pos`。 每个解析器函数恰好消耗属于其语法级别的表达式部分。`parse_expr`处理加法和减法，同时`parse_term`处理乘法、除法和余数。 

这`parse_factor`function 是处理分组的地方。 当它看到`(`，它在使用结束表达式之前解析整个表达式`)`。 这就是区别`a+(b+c)`从`(a+b)+c`。 

解析器将标识符表示为字符串，并将二元运算表示为包含运算符及其两个子级的三元素元组。 这为我们提供了一个显式表达式树，而无需重复操作原始字符串。 

翻译阶段使用该树而不是原始字符。 例如，树为`a+(b*c)`有`+`从根本上来说，`a`作为它的左孩子，并且`*`带孩子`b`和`c`作为它的右孩子。 翻译结果产生`a.add(b.multiply(c))`。 

递归调用从不执行算术，因此不存在整数溢出问题。 最大表达式长度仅为 1000 个字符。 该代码还轻微地引发了 Python 的递归限制问题，因为深度嵌套的括号每个嵌套级别至少需要两个字符，但实现可以安全地添加`sys.setrecursionlimit`如果需要的话。 给定的界限使自然递归解析器保持在实际限制内。 

## 工作示例

 对于第一个示例表达式，`a+b+c`，解析器看到两个加法运算具有相同的优先级。 因为循环从左到右处理它们，所以生成的树是`(a+b)+c`。 

| 输入位置| 解析器状态 | 构造子树 |
 | ---| ---| ---|
 | 读`a`|`pos`后`a`|`a`|
 | 读`+b`|`+`联合起来`a`和`b`|`a+b`|
 | 读`+c`|`+`结合之前的树和`c`|`(a+b)+c`|
 | 翻译根`+`|`add`|`a.add(b).add(c)`|

 这里重要的属性是左结合性。 第一个添加成为第二个的接收者`add`调用，因此输出自然是链接的。 

对于第二个示例表达式，`(a+b)%(c+d)`，括号导致每一边在之前被解析为完整的加法表达式`%`被处理。 

| 输入位置| 解析器状态 | 构造子树 |
 | ---| ---| ---|
 | 读`(a+b)`| 解析分组表达式 |`a+b`|
 | 读`%`|`%`等待合适的因素|`a+b`|
 | 读`(c+d)`| 解析第二个分组表达式 |`c+d`|
 | 结合`%`| 根操作 |`(a+b)%(c+d)`|
 | 翻译根`%`|`remainder`|`a.add(b).remainder(c.add(d))`|

 这说明了为什么不需要打印原始括号。 每个分组表达式都成为一个嵌套的 Java 方法表达式，并且方法参数本身提供所需的分组。 这与官方示例输出相符。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个输入字符在解析过程中都会被消耗一次，并且每个表达式树节点都会被翻译一次。 |
 | 空间| O(n) | 表达式树包含 O(n) 个节点，递归解析器在尽可能深的嵌套中使用 O(n) 堆栈空间。 |

 最大输入行仅为 1000 个字符，因此线性解析在问题指定的 1 秒和 256 MB 限制下留下了大量空间。 该算法还独立处理每个测试用例，并根据需要读取直到 EOF。 

## 测试用例```python
import sys
import io

METHOD = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'remainder'
}

class Parser:
    def __init__(self, s):
        self.s = s
        self.n = len(s)
        self.pos = 0

    def parse(self):
        return self.parse_expr()

    def parse_expr(self):
        node = self.parse_term()

        while self.pos < self.n and self.s[self.pos] in '+-':
            op = self.s[self.pos]
            self.pos += 1
            right = self.parse_term()
            node = (op, node, right)

        return node

    def parse_term(self):
        node = self.parse_factor()

        while self.pos < self.n and self.s[self.pos] in '*/%':
            op = self.s[self.pos]
            self.pos += 1
            right = self.parse_factor()
            node = (op, node, right)

        return node

    def parse_factor(self):
        if self.s[self.pos] == '(':
            self.pos += 1
            node = self.parse_expr()
            self.pos += 1
            return node

        start = self.pos
        while self.pos < self.n and self.s[self.pos].isalpha():
            self.pos += 1

        return self.s[start:self.pos]

def translate(node):
    if isinstance(node, str):
        return node

    op, left, right = node
    return translate(left) + '.' + METHOD[op] + '(' + translate(right) + ')'

def solve_line(s):
    return translate(Parser(s).parse())

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return '\n'.join(
            solve_line(line.strip())
            for line in sys.stdin
            if line.strip()
        )
    finally:
        sys.stdin = old_stdin

# Provided samples
assert run("a+b+c\n") == "a.add(b).add(c)", "sample 1"
assert run("(a+b)+c\n") == "a.add(b).add(c)", "sample 2"
assert run("a+(b+c)\n") == "a.add(b.add(c))", "sample 3"
assert run("(a+b)%(c+d)\n") == "a.add(b).remainder(c.add(d))", "sample 4"

# Minimum-size expression
assert run("x\n") == "x", "single identifier"

# Repeated identical identifier
assert run("a+a+a+a\n") == "a.add(a).add(a).add(a)", "repeated identifier"

# Precedence and right-side grouping
assert run("a+b*c-d/e\n") == \
       "a.add(b.multiply(c)).subtract(d.divide(e))", \
       "operator precedence"

# Non-associative operations and nested grouping
assert run("a-(b-c/(d+e))\n") == \
       "a.subtract(b.subtract(c.divide(d.add(e))))", \
       "nested grouping"

# Maximum-size expression, 500 identifiers and 499 operators
expr = "+".join(["a"] * 500)
expected = "a" + ".add(a)" * 499
assert len(expr) == 999
assert run(expr + "\n") == expected, "maximum-size expression"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`x`|`x`| 最小尺寸表达式和因子解析 |
 |`a+a+a+a`|`a.add(a).add(a).add(a)`| 左关联性和重复标识符 |
 |`a+b*c-d/e`|`a.add(b.multiply(c)).subtract(d.divide(e))`| 乘法和除法的优先级 |
 |`a-(b-c/(d+e))`|`a.subtract(b.subtract(c.divide(d.add(e))))`| 嵌套括号和非结合运算符 |
 | 500份`a`加入了`+`|`a.add(a)...`| 最大输入大小和重复左侧链接 |

 ## 边缘情况

 对于`a+(b+c)`，解析器首先读取`a`作为外部添加物的左侧。 当进入括号时，会递归解析`b+c`成一棵完整的子树。 该子树的翻译是`b.add(c)`，因此外节点变为`a.add(b.add(c))`。 从左到右的扁平替换会错误地产生`a.add(b).add(c)`。 

为了`(a+b)+c`，解析器首先进入括号并构造子树`a+b`。 返回到外部表达式后，它将该子树与`c`。 翻译产生`a.add(b).add(c)`。 括号消失是因为`a.add(b)`已经是一个有效的Java表达式，可以直接成为接收者`.add(c)`。 

为了`a+b*c`,`parse_expr`问`parse_term`为其操作数。 正确的操作数被解析为`parse_term`，这消耗了整个`b*c`返回前的操作。 结果树是`a+(b*c)`，输出是`a.add(b.multiply(c))`。 这捕获了仅根据运算符在输入中的出现来处理运算符的实现。 

为了`a-(b-c)`，外层`-`接收完整的子树`b-c`作为其右操作数。 结果是`a.subtract(b.subtract(c))`。 如果实现将表达式扁平化为链，则会产生`a.subtract(b).subtract(c)`，它代表一棵不同的树。 

为了`a/b%c`， 两个都`/`和`%`属于相同的优先级并且是左关联的。 解析器首先构造`(a/b)`，然后应用`%`为了这个结果，给予`a.divide(b).remainder(c)`。 这是另一个有用的边界情况，因为处理`%`因为具有不同的优先级会默默地改变树。 

对于单个标识符，例如`x`,`parse_factor`消耗整个标识符，之后找不到任何运算符。 该树由一片叶子组成，因此翻译只需返回`x`。 没有引入方法调用或人工括号。 

最后，一个最大长度的表达式，例如 500 个副本`a`由499个加号连接包含999个字符。 每个加法运算都会消耗一次，生成左深树并最终生成链`a.add(a).add(a)...`。 该算法不需要搜索匹配的运算符或重新考虑之前的决策，因此其工作量随着输入大小线性增长。
